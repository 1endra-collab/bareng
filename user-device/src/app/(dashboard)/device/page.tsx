import { prisma } from "@/lib/prisma";
import { Device } from "@prisma/client";
import { EditDeviceModal } from "@/components/EditDeviceModal"; 
import { AddDeviceModal } from "@/components/AddDeviceModal"; // Pastikan path ini benar

export default async function DevicePage() {
  const devices = await prisma.device.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Sementara diset true untuk testing admin panel.
  const isAdmin = true;

  return (
    <div className="p-1">
      {/* HEADER: Judul Halaman & Tombol Tambah Device */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Device</h1>
        
        {/* Tombol Tambah hanya muncul jika User adalah Admin */}
        {isAdmin && <AddDeviceModal />}
      </div>

      {/* GRID CONTAINER: Daftar Card Laptop/PC */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device: Device) => {
          // Deteksi apakah device berstatus Rusak dari string penanda text di database
          const isRusak = device.type.toLowerCase().includes("[rusak]");
          // Membersihkan teks "[RUSAK]" agar tidak ikut tampil mengotori nama tipe di komponen UI
          const cleanType = device.type.replace(/\s*\[RUSAK\]/gi, "");

          return (
            <div
              key={device.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{device.name}</h2>
                  <p className="text-sm text-gray-500">{cleanType}</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Ketersediaan Dinamis (3 Kondisi) */}
                  <div>
                    {isRusak ? (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-600 font-medium">
                        Rusak
                      </span>
                    ) : device.isAvailable ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600 font-medium">
                        Tersedia
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-600 font-medium">
                        Dipakai
                      </span>
                    )}
                  </div>

                  {/* TOMBOL EDIT & HAPUS KHUSUS ADMIN */}
                  {isAdmin && (
                    <EditDeviceModal 
                      device={{
                        id: device.id,
                        name: device.name,
                        isAvailable: device.isAvailable,
                        type: device.type // Menyertakan tipe asli untuk pengecekan modal
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}