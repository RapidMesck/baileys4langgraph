import { langClient } from "../../utils/langgraph";
import { PrismaClient, Users } from '@prisma/client';

const prisma = new PrismaClient();

export async function createThread(user: Users) {
    const thread = await langClient.threads.create({
        metadata: {
            userId: user.id,
            userInfos: user.metadata,
        },
        ifExists: "do_nothing"
    })

    return prisma.usersThreads.create({
        data: {
            userId: user.id,
            threadId: thread.thread_id
        }
    })
}

export async function getLangThread(userThreadId: string) {
    const userThread = await prisma.usersThreads.findUnique({
        where: {
            id: userThreadId
        }
    })

    if (!userThread) return null

    return await langClient.threads.get(userThread.threadId)
}

export async function updateLastInputThread(userThreadId: string, input: string) {
    return prisma.usersThreads.update({
        where: {
            id: userThreadId
        },
        data: {
            lastInput: input
        }
    })
}

export async function deleteThread(userThreadId: string) {
    const userThread = await prisma.usersThreads.findUnique({
        where: {
            id: userThreadId
        }
    })

    if (!userThread) return null

    await langClient.threads.delete(userThread.threadId)

    return prisma.usersThreads.delete({
        where: {
            id: userThread.id
        }
    })
}

export async function runThread(threadId: string, assistantId: string, msgs: Array<Object>) {
    const res = await langClient.runs.wait(
        threadId,
        assistantId,
        { input: { messages: msgs } }
    )
    
    return res
    
}