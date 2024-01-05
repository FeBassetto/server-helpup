/*
  Warnings:

  - You are about to drop the column `group_relation_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `groups` table. All the data in the column will be lost.
  - Added the required column `admin_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('physical', 'visual', 'auditory', 'mental');

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_group_relation_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_user_id_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_user_id_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "group_relation_id",
DROP COLUMN "time",
DROP COLUMN "user_id",
ADD COLUMN     "admin_id" TEXT NOT NULL,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "type" "EventType" NOT NULL;

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "user_id",
ADD COLUMN     "admin_id" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
