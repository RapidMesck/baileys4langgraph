import { Prisma, PrismaClient, Messages } from '@prisma/client';

const prisma = new PrismaClient();

export async function createMessage(userId: string, remoteJid: string, content: string, dataJson: any = {}): Promise<Messages> {
  return prisma.messages.create({
    data: {
      userId,
      remoteJid,
      content,
      dataJson,
    },
  });
}

export async function getMessageById(id: string): Promise<Messages | null> {
  return prisma.messages.findUnique({
    where: { id },
  });
}

export async function getMessagesByUserId(userId: string): Promise<Messages[]> {
  return prisma.messages.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getLastUserMessages(
    userId: string,
    limit: number = 10,
    since?: Date
): Promise<Messages[]> {
    return prisma.messages.findMany({
        where: {
            userId,
            ...(since && { createdAt: { gt: since } }),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}

export async function updateMessage(
  id: string,
  data: Prisma.MessagesUpdateInput
): Promise<Messages> {
  return prisma.messages.update({
    where: { id },
    data,
  });
}

export async function deleteMessage(id: string): Promise<Messages> {
  return prisma.messages.delete({
    where: { id },
  });
}
