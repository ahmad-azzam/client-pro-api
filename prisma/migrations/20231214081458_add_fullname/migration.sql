/*
  Warnings:

  - Added the required column `fullname` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "fullname" TEXT NOT NULL;
