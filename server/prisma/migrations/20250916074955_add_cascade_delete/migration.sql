/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `EmailVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PhotoShare" DROP CONSTRAINT "PhotoShare_photoId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_email_key" ON "EmailVerification"("email");

-- AddForeignKey
ALTER TABLE "PhotoShare" ADD CONSTRAINT "PhotoShare_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "uploadData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
