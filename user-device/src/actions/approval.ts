"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// === 1. FUNGSI UNTUK MENYETUJUI (APPROVE) ===
export async function approvePeminjaman(id: string) {
  const peminjamanAktif = await prisma.peminjaman.findUnique({
    where: { id },
    select: { deviceId: true, status: true },
  });

  if (!peminjamanAktif) {
    throw new Error("Data pengajuan tidak ditemukan.");
  }

  if (peminjamanAktif.status !== "pending") {
    throw new Error("Pengajuan ini sudah diproses sebelumnya.");
  }

  const device = await prisma.device.findUnique({
    where: { id: peminjamanAktif.deviceId },
    select: { isAvailable: true }
  });

  if (!device || !device.isAvailable) {
    throw new Error("Gagal menyetujui. Perangkat sudah dipinjam oleh orang lain duluan!");
  }

  await prisma.$transaction([
    prisma.peminjaman.update({
      where: { id },
      data: { status: "approved" },
    }),
    prisma.device.update({
      where: { id: peminjamanAktif.deviceId },
      data: { isAvailable: false },
    }),
    prisma.peminjaman.updateMany({
      where: {
        deviceId: peminjamanAktif.deviceId,
        status: "pending",
        id: { not: id },
      },
      data: {
        status: "rejected",
        note: "Otomatis ditolak sistem karena perangkat ini sudah disetujui untuk dipinjam oleh user lain terlebih dahulu.",
      },
    }),
  ]);

  redirect("/approval");
}

// === 2. FUNGSI UNTUK MENOLAK (REJECT) YANG HILANG ===
export async function rejectPeminjaman(id: string, note: string) {
  const peminjamanAktif = await prisma.peminjaman.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!peminjamanAktif) {
    throw new Error("Data pengajuan tidak ditemukan.");
  }

  if (peminjamanAktif.status !== "pending") {
    throw new Error("Pengajuan ini sudah diproses sebelumnya.");
  }

  // Ubah status menjadi rejected dan simpan alasan penolakan dari admin
  await prisma.peminjaman.update({
    where: { id },
    data: {
      status: "rejected",
      note: note || "Ditolak oleh Admin.",
    },
  });

  redirect("/approval");
}
