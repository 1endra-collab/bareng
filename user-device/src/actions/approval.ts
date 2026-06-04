"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function approvePeminjaman(
  id: string
) {
  const peminjaman =
    await prisma.peminjaman.findUnique({
      where: {
        id,
      },
    });

  if (!peminjaman) return;

  const device =
    await prisma.device.findUnique({
      where: {
        id: peminjaman.deviceId,
      },
    });

  if (!device?.isAvailable) {
    throw new Error(
      "Device sudah dipinjam user lain"
    );
  }

  await prisma.peminjaman.update({
    where: {
      id,
    },
    data: {
      status: "approved",
    },
  });

  await prisma.device.update({
    where: {
      id: peminjaman.deviceId,
    },
    data: {
      isAvailable: false,
    },
  });

  revalidatePath("/approval");
}

export async function rejectPeminjaman(
  id: string,
  note: string
) {
  await prisma.peminjaman.update({
    where: {
      id,
    },
    data: {
      status: "rejected",
      note,
    },
  });

  revalidatePath("/approval");
}