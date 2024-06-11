-- DropForeignKey
ALTER TABLE "client_files" DROP CONSTRAINT "client_files_client_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "client_files" DROP CONSTRAINT "client_files_file_type_id_fkey";

-- DropForeignKey
ALTER TABLE "client_folders" DROP CONSTRAINT "client_folders_client_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_project_files" DROP CONSTRAINT "employee_project_files_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_project_files" DROP CONSTRAINT "employee_project_files_project_file_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_projects" DROP CONSTRAINT "employee_projects_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "employee_projects" DROP CONSTRAINT "employee_projects_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_files" DROP CONSTRAINT "project_files_file_type_id_fkey";

-- DropForeignKey
ALTER TABLE "project_files" DROP CONSTRAINT "project_files_project_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "project_folders" DROP CONSTRAINT "project_folders_client_folder_id_fkey";

-- AddForeignKey
ALTER TABLE "project_folders" ADD CONSTRAINT "project_folders_client_folder_id_fkey" FOREIGN KEY ("client_folder_id") REFERENCES "client_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_folders" ADD CONSTRAINT "client_folders_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_files" ADD CONSTRAINT "client_files_file_type_id_fkey" FOREIGN KEY ("file_type_id") REFERENCES "file_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_files" ADD CONSTRAINT "client_files_client_folder_id_fkey" FOREIGN KEY ("client_folder_id") REFERENCES "client_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_project_folder_id_fkey" FOREIGN KEY ("project_folder_id") REFERENCES "project_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_file_type_id_fkey" FOREIGN KEY ("file_type_id") REFERENCES "file_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_project_files" ADD CONSTRAINT "employee_project_files_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_project_files" ADD CONSTRAINT "employee_project_files_project_file_id_fkey" FOREIGN KEY ("project_file_id") REFERENCES "project_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_projects" ADD CONSTRAINT "employee_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_projects" ADD CONSTRAINT "employee_projects_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
