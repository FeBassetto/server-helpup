/*
  Warnings:

  - You are about to drop the column `userId1` on the `friendships` table. All the data in the column will be lost.
  - You are about to drop the column `userId2` on the `friendships` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `friendships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverName` to the `friendships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `friendships` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `friendships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_userId1_fkey";

-- DropForeignKey
ALTER TABLE "friendships" DROP CONSTRAINT "friendships_userId2_fkey";

-- AlterTable
ALTER TABLE "friendships" DROP COLUMN "userId1",
DROP COLUMN "userId2",
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "receiverName" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
