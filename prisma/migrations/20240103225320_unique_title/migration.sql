/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groups_title_key" ON "groups"("title");
