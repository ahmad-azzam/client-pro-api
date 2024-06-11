/*
  Warnings:

  - A unique constraint covering the columns `[mime]` on the table `file_types` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "file_types_mime_key" ON "file_types"("mime");
