/*
  Warnings:

  - You are about to drop the `UserSharedPhotos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSharedPhotos" DROP CONSTRAINT "UserSharedPhotos_uploadDataId_fkey";

-- DropForeignKey
ALTER TABLE "UserSharedPhotos" DROP CONSTRAINT "UserSharedPhotos_userId_fkey";

-- AlterTable
ALTER TABLE "uploadData" ADD COLUMN     "sharedWith" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- DropTable
DROP TABLE "UserSharedPhotos";
