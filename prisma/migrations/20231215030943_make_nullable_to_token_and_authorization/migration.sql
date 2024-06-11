-- DropForeignKey
ALTER TABLE "authentications" DROP CONSTRAINT "authentications_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_employee_id_fkey";

-- AlterTable
ALTER TABLE "authentications" ALTER COLUMN "employee_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "employee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authentications" ADD CONSTRAINT "authentications_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
