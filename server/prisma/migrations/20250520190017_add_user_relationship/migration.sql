-- CreateTable
CREATE TABLE "uploadData" (
    "id" SERIAL NOT NULL,
    "photo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "uploadData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "uploadData" ADD CONSTRAINT "uploadData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
