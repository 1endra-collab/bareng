import { prisma } from "@/lib/prisma";
import { Device } from "@prisma/client";
import { EditDeviceModal } from "@/components/EditDeviceModal"; 
import { AddDeviceModal } from "@/components/AddDeviceModal";
import { cookies } from "next/headers";

// Fungsi aman untuk mengambil data user langsung dari tabel User bawaan proyekmu
async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    
    // Ambil token login (biasanya berisi user ID atau data login)
    // Coba deteksi nama cookie kamu: "session", "token", "auth", atau "user"
    const sessionToken = cookieStore.get("session")?.value || cookieStore.get("token")?.value;

    if (!sessionToken) return null;

    // --- CARA 1: Jika isi cookie kamu adalah ID User langsung ---
    const userById = await prisma.user.findUnique({
      where: { id: sessionToken },
    });
    if (userById) return userById;

    // --- CARA 2: Jika isi cookie kamu adalah Email User ---
    const userByEmail = await prisma.user.findUnique({
      where: { email: sessionToken },
    });
    if (userByEmail) return userByEmail;

    return null;
  } catch (error) {
    console.error("Gagal memuat data user:", error);
    return null;
  }
}

export default async function DevicePage() {
  // 1. Ambil data devices dari database
  const devices = await prisma.device.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Ambil data user aktif
  const user = await getSessionUser();
  
  // Ambil role user (pastikan di database tulisan role kamu adalah "ADMIN" huruf besar)
  const isAdmin = user?.role === "ADMIN" || user?.role === "admin"; 

  return (
    <div className="p-1">
      {/* HEADER: Judul Halaman & Tombol Tambah Device */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Device</h1>
        
        {/* Tombol Tambah otomatis tersembunyi bagi user biasa */}
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

                  {/* Tombol Edit otomatis tersembunyi jika bukan Admin */}
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