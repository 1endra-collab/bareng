/*
  Warnings:

  - Added the required column `kelasPeminjam` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaPeminjam` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnDate` to the `Peminjaman` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Peminjaman" DROP CONSTRAINT "Peminjaman_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Peminjaman" DROP CONSTRAINT "Peminjaman_userId_fkey";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "image" TEXT,
ADD COLUMN     "kelas" TEXT,
ADD COLUMN     "lokasi" TEXT,
ADD COLUMN     "merk" TEXT;

-- AlterTable
ALTER TABLE "Peminjaman" ADD COLUMN     "dueAt" TIMESTAMP(3),
ADD COLUMN     "kelasPeminjam" TEXT NOT NULL,
ADD COLUMN     "komputerId" TEXT,
ADD COLUMN     "namaPeminjam" TEXT NOT NULL,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnTime" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "deviceId" DROP NOT NULL,
ALTER COLUMN "purpose" DROP NOT NULL,
ALTER COLUMN "borrowTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin';

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "totalKomputer" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComputerSlot" (
    "id" TEXT NOT NULL,
    "nomor" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'tersedia',
    "labId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComputerSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComputerSlot_labId_nomor_key" ON "ComputerSlot"("labId", "nomor");

-- AddForeignKey
ALTER TABLE "ComputerSlot" ADD CONSTRAINT "ComputerSlot_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peminjaman" ADD CONSTRAINT "Peminjaman_komputerId_fkey" FOREIGN KEY ("komputerId") REFERENCES "ComputerSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
