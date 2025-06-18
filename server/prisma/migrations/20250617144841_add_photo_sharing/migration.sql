-- CreateTable
CREATE TABLE "UserSharedPhotos" (
    "userId" INTEGER NOT NULL,
    "uploadDataId" INTEGER NOT NULL,

    CONSTRAINT "UserSharedPhotos_pkey" PRIMARY KEY ("userId","uploadDataId")
);

-- AddForeignKey
ALTER TABLE "UserSharedPhotos" ADD CONSTRAINT "UserSharedPhotos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSharedPhotos" ADD CONSTRAINT "UserSharedPhotos_uploadDataId_fkey" FOREIGN KEY ("uploadDataId") REFERENCES "uploadData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
