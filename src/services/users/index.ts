import { Prisma, PrismaClient, Users } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(remoteJid: string, metadata?: any): Promise<Users> {
  return prisma.users.create({
    data: {
      remoteJid: [remoteJid],
      metadata,
    },
  });
}

export async function getUserById(id: string): Promise<Users | null> {
  return prisma.users.findUnique({
    where: { id },
  });
}

export async function getUserByRemoteJid(remoteJid: string): Promise<Users | null> {
  return prisma.users.findFirst({
    where: { remoteJid: { has: remoteJid } },
  });
}

export async function getOrCreateUser(remoteJid: string, metadata?: any): Promise<Users> {
    let user = await getUserByRemoteJid(remoteJid);
    if (user) return user;
    return createUser(remoteJid, metadata);
}

export async function updateUser(id: string, data: Partial<Users>): Promise<Users> {
  // Map metadata to Prisma.DbNull if it's null
  const updateData = {
    ...data,
    metadata: data.metadata === null ? Prisma.DbNull : data.metadata,
  };
  return prisma.users.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteUser(id: string): Promise<Users> {
  return prisma.users.delete({
    where: { id },
  });
}

export async function getUserMessages(userId: string): Promise<any[]> {
  return prisma.messages.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}