/*
  Warnings:

  - You are about to drop the column `redirectId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `redirect_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "redirectId",
ADD COLUMN     "redirect_id" TEXT NOT NULL;
