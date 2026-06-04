"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// === FUNGSI NOTIFIKASI GOOGLE CHAT ===
async function kirimNotifGoogleChat(deviceName: string, namaPeminjam: string, tanggal: string, jam: string) {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("URL Webhook Google Chat belum dikonfigurasi di .env");
    return;
  }

  const payload = {
    text: `*NOTIFIKASI PEMINJAMAN BARU* 🚨\n\n` +
          `• *Barang:* ${deviceName}\n` +
          `• *Peminjam:* ${namaPeminjam}\n` +
          `• *Tanggal:* ${tanggal}\n` +
          `• *Jam:* ${jam}\n\n` +
          `_Silakan cek dashboard admin menu Approval untuk memproses._`
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(payload),
    });
    console.log("Notifikasi Google Chat berhasil dikirim!");
  } catch (error) {
    console.error("Gagal mengirim ke Google Chat:", error);
  }
}
// ======================================

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

  // Ambil nama device terlebih dahulu dari database untuk kebutuhan notifikasi
  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    select: { name: true }
  });
  const nameDevice = device ? device.name : "Device Tidak Diketahui";

  // hitung dueAt dari tanggal + jam selesai
  const dueAt = new Date(`${borrowDate}T${returnTime}:00`);

  // 1. Simpan ke Database
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

  // 2. PANGGIL NOTIFIKASI GOOGLE CHAT DI SINI (Sebelum redirect)
  await kirimNotifGoogleChat(
    nameDevice, 
    user.name || clerkUser.emailAddresses[0].emailAddress, 
    borrowDate, 
    `${borrowTime} - ${returnTime}`
  );

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