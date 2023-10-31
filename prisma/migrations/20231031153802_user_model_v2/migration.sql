/*
  Warnings:

  - A unique constraint covering the columns `[nick]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cep` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_admin` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_confirmated` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_deleted` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nick` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cep" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "is_admin" BOOLEAN NOT NULL,
ADD COLUMN     "is_confirmated" BOOLEAN NOT NULL,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ADD COLUMN     "nick" TEXT NOT NULL,
ADD COLUMN     "profile_url" TEXT NOT NULL DEFAULT 'no_image.png';

-- CreateIndex
CREATE UNIQUE INDEX "users_nick_key" ON "users"("nick");
