/*
  Warnings:

  - You are about to drop the `Idds` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Idds";

-- CreateTable
CREATE TABLE "idds" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "idds_pkey" PRIMARY KEY ("id")
);
