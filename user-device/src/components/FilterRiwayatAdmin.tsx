"use client";

import { useRouter } from "next/navigation";

interface DeviceOption {
  id: string;
  name: string;
}

interface FilterProps {
  devices: DeviceOption[];
  currentStatus?: string;
  currentDeviceId?: string;
  currentRange?: string; // Tambahkan prop baru
}

export default function FilterRiwayatAdmin({ 
  devices, 
  currentStatus = "", 
  currentDeviceId = "" ,
  currentRange = "" // Default kosong (Semua Waktu)
}: FilterProps) {
  const router = useRouter();

  const handleFilterChange = (key: "status" | "deviceId" | "range", value: string) => {
    const url = new URL(window.location.href);
    
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
    
    router.push(url.pathname + url.search);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center rounded-2xl bg-white p-4 border shadow-sm text-black">
      {/* Filter Status */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <label className="text-xs font-semibold text-gray-500">Status</label>
        <select
          value={currentStatus}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm bg-gray-50 outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Semua Status</option>
          <option value="pending">Lagi diproses</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Filter Perangkat */}
      <div className="flex flex-col gap-1 min-w-[200px]">
        <label className="text-xs font-semibold text-gray-500">Pilih Perangkat</label>
        <select
          value={currentDeviceId}
          onChange={(e) => handleFilterChange("deviceId", e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm bg-gray-50 outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Semua Device</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* FILTER BARU: Rentang Waktu */}
      <div className="flex flex-col gap-1 min-w-[160px]">
        <label className="text-xs font-semibold text-gray-500">Rentang Waktu</label>
        <select
          value={currentRange}
          onChange={(e) => handleFilterChange("range", e.target.value)}
          className="rounded-lg border border-gray-200 p-2 text-sm bg-gray-50 outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Semua Waktu</option>
          <option value="hari-ini">Hari Ini</option>
          <option value="minggu-ini">Minggu Ini</option>
          <option value="bulan-ini">Bulan Ini</option>
        </select>
      </div>
    </div>
  );
}
