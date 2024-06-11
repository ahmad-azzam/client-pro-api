-- DropForeignKey
ALTER TABLE "project_folders" DROP CONSTRAINT "project_folders_project_id_fkey";

-- AddForeignKey
ALTER TABLE "project_folders" ADD CONSTRAINT "project_folders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
