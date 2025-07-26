/*
  Warnings:

  - You are about to drop the column `sharedWith` on the `uploadData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "uploadData" DROP COLUMN "sharedWith";

-- CreateTable
CREATE TABLE "PhotoShare" (
    "id" SERIAL NOT NULL,
    "photoId" INTEGER NOT NULL,
    "sharedById" INTEGER NOT NULL,
    "sharedWith" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhotoShare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhotoShare" ADD CONSTRAINT "PhotoShare_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "uploadData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoShare" ADD CONSTRAINT "PhotoShare_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
