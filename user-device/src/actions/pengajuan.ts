"use server";

import { prisma } from "@/lib/prisma";

import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

export async function createPeminjaman(
  formData: FormData
) {
  const { userId } = await auth();

  const clerkUser =
    await currentUser();

  if (!userId || !clerkUser) {
    throw new Error("Unauthorized");
  }

  // cek user
  let user =
    await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

  // kalau belum ada
  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,

        email:
          clerkUser.emailAddresses[0]
            .emailAddress,

        name:
          clerkUser.fullName || "",
      },
    });
  }

  // create peminjaman
  await prisma.peminjaman.create({
    data: {
      userId: user.id,

      deviceId:
        formData.get(
          "deviceId"
        ) as string,

      purpose:
        formData.get(
          "purpose"
        ) as string,

      borrowDate: new Date(
        formData.get(
          "borrowDate"
        ) as string
      ),

      borrowTime:
        formData.get(
          "borrowTime"
        ) as string,
    },
  });

  // ubah device jadi dipakai
  await prisma.device.update({
    where: {
      id: formData.get(
        "deviceId"
      ) as string,
    },

    data: {
      isAvailable: false,
    },
  });

  redirect("/riwayat");
}

export async function updatePeminjaman(
  id: string,
  formData: FormData
) {
  await prisma.peminjaman.update({
    where: {
      id,
    },

    data: {
      purpose:
        formData.get(
          "purpose"
        ) as string,

      borrowDate: new Date(
        formData.get(
          "borrowDate"
        ) as string
      ),

      borrowTime:
        formData.get(
          "borrowTime"
        ) as string,
    },
  });

  redirect("/riwayat");
}

export async function deletePeminjaman(
  id: string
) {
  // cari data peminjaman dulu
  const peminjaman =
    await prisma.peminjaman.findUnique({
      where: {
        id,
      },
    });

  // kalau data tidak ada
  if (!peminjaman) {
    return;
  }

  // ubah device jadi tersedia lagi
  await prisma.device.update({
    where: {
      id: peminjaman.deviceId,
    },

    data: {
      isAvailable: true,
    },
  });

  // hapus peminjaman
  await prisma.peminjaman.delete({
    where: {
      id,
    },
  });

  redirect("/riwayat");
}