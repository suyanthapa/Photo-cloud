-- DropForeignKey
ALTER TABLE "uploadData" DROP CONSTRAINT "uploadData_userId_fkey";

-- AddForeignKey
ALTER TABLE "uploadData" ADD CONSTRAINT "uploadData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
