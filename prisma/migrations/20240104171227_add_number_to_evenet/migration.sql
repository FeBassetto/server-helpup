/*
  Warnings:

  - Added the required column `number` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "number" INTEGER NOT NULL;
