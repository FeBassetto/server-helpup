/*
  Warnings:

  - Added the required column `neighborhood` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "neighborhood" TEXT NOT NULL;
