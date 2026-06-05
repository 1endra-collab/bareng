"use client";

import { useTransition } from "react";
import { Device } from "@prisma/client";
import { createPeminjaman } from "@/actions/pengajuan";

export default function FormPengajuan({ devices }: { devices: Device[] }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await createPeminjaman(formData);
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
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

      <textarea
        name="purpose"
        placeholder="Tujuan Peminjaman"
        className="w-full rounded-lg border p-3 text-black disabled:bg-gray-100"
        required
        disabled={isPending}
      />

      <input
        type="date"
        name="borrowDate"
        className="w-full rounded-lg border p-3 text-black disabled:bg-gray-100"
        required
        disabled={isPending}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Jam Mulai</label>
          <input
            type="time"
            name="borrowTime"
            className="w-full rounded-lg border p-3 text-black disabled:bg-gray-100"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Jam Selesai</label>
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
