import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  WASocket,
  AnyMessageContent
} from 'baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import P from 'pino';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();

async function main(): Promise<void> {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock: WASocket = makeWASocket({
    auth: state,
    logger: P({ level: 'warn' })
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      logger.info('📱 Scan this QR Code for login');
    }

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.warn('❌ Exit Connection. Reconnecting:', shouldReconnect);
      if (shouldReconnect) main();
    } else if (connection === 'open') {
      logger.info('✅ Successyfully connected to WhatsApp');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid!;
    const content: string | undefined =
      (msg.message.conversation ||
        (msg.message.extendedTextMessage?.text ?? '') ||
        (msg.message.imageMessage?.caption ?? '')).trim();
    
    logger.info(`📩 Received message from ${sender}: ${content}`);
  });
}

main();