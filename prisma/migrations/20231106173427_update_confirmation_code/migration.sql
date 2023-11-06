/*
  Warnings:

  - You are about to drop the column `is_used` on the `confirmation_codes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "confirmation_codes" DROP COLUMN "is_used";
