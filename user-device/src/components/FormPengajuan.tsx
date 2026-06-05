"use client";

import { useTransition, useState } from "react";
import { Device } from "@prisma/client";
// DI SINI SUDAH DIPERBAIKI: Menggunakan jalur relatif mundur 1 folder untuk masuk ke actions
import { createPeminjaman } from "../actions/pengajuan";

export default function FormPengajuan({ devices }: { devices: Device[] }) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TRIK JITU: Hitung langsung di sini tanpa useEffect agar extension tidak protes
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${year}-${month}-${day}`;

  const handleSubmit = (formData: FormData) => {
    setErrorMessage(null);

    const borrowTime = formData.get("borrowTime") as string;
    const returnTime = formData.get("returnTime") as string;

    // VALIDASI: Pastikan jam selesai tidak mendahului jam mulai
    if (borrowTime && returnTime) {
      if (returnTime <= borrowTime) {
        setErrorMessage("Jam Selesai harus lebih lambat daripada Jam Mulai.");
        return;
      }
    }

    startTransition(async () => {
      try {
        await createPeminjaman(formData);
      } catch (error: unknown) {
        // VALIDASI TIPE DATA: Ubah unknown menjadi objek Error yang valid agar ESLint senang
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Terjadi kesalahan sistem.");
        }
      }
    });

  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* TAMPILKAN PESAN ERROR */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* PILIH DEVICE */}
      <div className="relative">
        <select
          name="deviceId"
          className="w-full appearance-none rounded-lg border p-3 pr-12 text-black disabled:bg-gray-100"
          required
          disabled={isPending}
        >
          <option value="">Pilih Device</option>
          {devices.map((device: Device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
          ▼
        </div>
      </div>

      {/* TUJUAN PEMINJAMAN */}
      <textarea
        name="purpose"
        placeholder="Tujuan Peminjaman"
        className="w-full rounded-lg border p-3 text-black disabled:bg-gray-100"
        required
        disabled={isPending}
      />

      {/* INPUT TANGGAL (Dibatasi minimal hari ini) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal Peminjaman</label>
        <input
          type="date"
          name="borrowDate"
          min={todayDate} // Mengunci tanggal agar user tidak bisa pilih hari kemarin
          className="w-full rounded-lg border p-3 text-black disabled:bg-gray-100"
          required
          disabled={isPending}
        />
      </div>

      {/* INPUT JAM */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Jam Mulai</label>
          <input
            type="time"
            name="borrowTime"
            className="w-full rounded-lg border p-3 text-black disabled:bg-gray-100"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Jam Selesai</label>
          <input
            type="time"
            name="returnTime"
            className="w-full rounded-lg border p-3 text-black disabled:bg-gray-100"
            required
            disabled={isPending}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`w-full sm:w-auto rounded-lg px-5 py-3 text-white font-medium transition-all ${
          isPending
            ? "bg-gray-400 cursor-not-allowed opacity-80"
            : "bg-blue-500 hover:bg-blue-600 active:scale-[0.98]"
        }`}
      >
        {isPending ? "Memproses..." : "Ajukan"}
      </button>
    </form>
  );
}
