"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. ACTION UPDATE & EDIT
export async function updateDeviceStatus(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const statusSelect = formData.get("statusSelect") as string // menangkap status: "tersedia", "dipakai", "rusak"

  if (!name) {
    return { success: false, error: "Nama device tidak boleh kosong!" }
  }

  try {
    // Ambil data tipe asli device saat ini terlebih dahulu
    const currentDevice = await prisma.device.findUnique({ where: { id } })
    if (!currentDevice) return { success: false, error: "Device tidak ditemukan" }

    // Bersihkan teks [RUSAK] lama jika ada di dalam kolom type
    let cleanType = currentDevice.type.replace(/\s*\[RUSAK\]/gi, "")

    // Tentukan nilai boolean database dan modifikasi tipe jika statusnya rusak
    let isAvailable = false
    if (statusSelect === "tersedia") {
      isAvailable = true
    } else if (statusSelect === "rusak") {
      cleanType = `${cleanType} [RUSAK]`
    }

    await prisma.device.update({
      where: { id },
      data: {
        name: name,
        isAvailable: isAvailable,
        type: cleanType
      },
    })

    revalidatePath("/device")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Gagal memperbarui data device" }
  }
}

// 2. ACTION HAPUS / DELETE DEVICE (Fitur Baru ke-2!)
export async function deleteDevice(id: string) {
  try {
    await prisma.device.delete({
      where: { id }
    })
    revalidatePath("/device")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error: "Gagal menghapus device" }
  }
}

// 3. ACTION TAMBAH DEVICE
export async function createDevice(formData: FormData) {
  const name = formData.get("name") as string
  const type = formData.get("type") as string

  if (!name || !type) {
    return { success: false, error: "Semua data wajib diisi!" }
  }

  try {
    await prisma.device.create({
      data: {
        name: name,
        type: type,
        isAvailable: true,
      },
    })
    revalidatePath("/device")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Gagal menambahkan device" }
  }
}