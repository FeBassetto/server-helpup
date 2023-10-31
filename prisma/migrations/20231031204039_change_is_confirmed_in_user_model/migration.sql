/*
  Warnings:

  - You are about to drop the column `is_confirmated` on the `users` table. All the data in the column will be lost.
  - Added the required column `is_confirmed` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_confirmated",
ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL;
