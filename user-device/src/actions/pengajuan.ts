"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createPeminjaman(formData: FormData) {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) {
    throw new Error("Unauthorized");
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.fullName || "",
      },
    });
  }

  const deviceId = formData.get("deviceId") as string;
  const purpose = formData.get("purpose") as string;
  const borrowDate = formData.get("borrowDate") as string;
  const borrowTime = formData.get("borrowTime") as string;
  const returnTime = formData.get("returnTime") as string;

  // hitung dueAt dari tanggal + jam selesai
  const dueAt = new Date(`${borrowDate}T${returnTime}:00`);

  await prisma.peminjaman.create({
    data: {
      userId: user.id,
      deviceId,
      purpose,
      borrowDate: new Date(borrowDate),
      borrowTime,
      returnTime,
      dueAt,
    },
  });

  redirect("/riwayat");
}

export async function updatePeminjaman(id: string, formData: FormData) {
  const borrowDate = formData.get("borrowDate") as string;
  const returnTime = formData.get("returnTime") as string;

  // update dueAt juga kalau edit
  const dueAt = returnTime
    ? new Date(`${borrowDate}T${returnTime}:00`)
    : undefined;

  await prisma.peminjaman.update({
    where: { id },
    data: {
      purpose: formData.get("purpose") as string,
      borrowDate: new Date(borrowDate),
      borrowTime: formData.get("borrowTime") as string,
      returnTime,
      ...(dueAt && { dueAt }),
    },
  });

  redirect("/riwayat");
}

export async function deletePeminjaman(id: string) {
  const peminjaman = await prisma.peminjaman.findUnique({
    where: { id },
  });

  if (!peminjaman) return;

  await prisma.device.update({
    where: { id: peminjaman.deviceId },
    data: { isAvailable: true },
  });

  await prisma.peminjaman.delete({
    where: { id },
  });

  redirect("/riwayat");
}