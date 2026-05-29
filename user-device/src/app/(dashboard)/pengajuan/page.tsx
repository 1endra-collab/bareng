import { prisma } from "@/lib/prisma";
import { Device } from "@prisma/client";


import { createPeminjaman } from "@/actions/pengajuan";

export default async function PengajuanPage() {
  const devices = await prisma.device.findMany({
    where: {
      isAvailable: true,
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        Ajukan Peminjaman
      </h1>

      <form
        action={createPeminjaman}
        className="space-y-4"
      >
<div className="relative">
  <select
    name="deviceId"
    className="w-full appearance-none rounded-lg border p-3 pr-12"
    required
  >
    <option value="">
      Pilih Device
    </option>

    {devices.map((device: Device) => (
      <option
        key={device.id}
        value={device.id}
      >
        {device.name}
      </option>
    ))}
  </select>

  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
    ▼
  </div>
</div>

        <textarea
          name="purpose"
          placeholder="Tujuan Peminjaman"
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="date"
          name="borrowDate"
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="time"
          name="borrowTime"
          className="w-full rounded-lg border p-3"
          required
        />

        <button className="rounded-lg bg-blue-500 px-5 py-3 text-white">
          Ajukan
        </button>
      </form>
    </div>
  );
}