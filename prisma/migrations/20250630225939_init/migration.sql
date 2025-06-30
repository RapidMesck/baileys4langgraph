-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "remoteJid" TEXT[],
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "remoteJid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "dataJson" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_remoteJid_idx" ON "users"("remoteJid");

-- CreateIndex
CREATE INDEX "messages_userId_remoteJid_idx" ON "messages"("userId", "remoteJid");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
