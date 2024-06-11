-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_project_status_id_fkey";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_project_status_id_fkey" FOREIGN KEY ("project_status_id") REFERENCES "project_status"("id") ON DELETE CASCADE ON UPDATE CASCADE;
