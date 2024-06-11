/*
  Warnings:

  - You are about to drop the `forms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "forms";

-- CreateTable
CREATE TABLE "contact_us_forms" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "project_desc" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "platform" TEXT NOT NULL,

    CONSTRAINT "contact_us_forms_pkey" PRIMARY KEY ("id")
);
