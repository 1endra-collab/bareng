import { AddDeviceModal } from "@/components/AddDeviceModal";
import { EditDeviceModal } from "@/components/EditDeviceModal"; 
import { prisma } from "@/lib/prisma";
import { Device } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export default async function DevicePage() {
  // 1. Ambil data dari database perangkat
  const devices = await prisma.device.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Ambil userId Clerk dari orang yang sedang membuka browser saat ini
  const { userId } = await auth();

  let isAdmin = false;

  // 3. Cari user tersebut di dalam database lokal berdasarkan kolom 'clerkId'
  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }, // Menyamakan userId Clerk dengan kolom clerkId di db kamu
    });

    // Jika user ditemukan dan nilai kolom role-nya adalah "admin"
    if (dbUser && dbUser.role === "admin") {
      isAdmin = true;
    }
  }

  return (
    <div className="p-1">
      {/* HEADER: Judul Halaman & Tombol Tambah Device */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Device</h1>
        
        {/* Tombol Tambah hanya muncul jika terverifikasi admin dari DB */}
        {isAdmin && <AddDeviceModal />}
      </div>

      {/* GRID CONTAINER: Daftar Card Laptop/PC */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device: Device) => {
          const isRusak = device.type.toLowerCase().includes("[rusak]");
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
                  {/* Status Ketersediaan */}
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

                  {/* Tombol Edit hanya muncul jika terverifikasi admin dari DB */}
                  {isAdmin && (
                    <EditDeviceModal 
                      device={{
                        id: device.id,
                        name: device.name,
                        isAvailable: device.isAvailable,
                        type: device.type
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