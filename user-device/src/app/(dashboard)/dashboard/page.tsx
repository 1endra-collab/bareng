import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import OverdueAlert from "@/components/OverdueAlert";

// === FUNGSI OTOMATISASI DATABASE (NON-BLOCKING) ===
async function bersihkanDataOverdue(now: Date) {
  try {
    // 1. Auto reject yang sudah lewat dueAt tapi masih pending
    await prisma.peminjaman.updateMany({
      where: {
        status: "pending",
        dueAt: { lt: now },
      },
      data: {
        status: "rejected",
        note: "Otomatis ditolak karena melewati batas waktu pengajuan, silahkan ajukan ulang dengan waktu yang lebih tepat",
      },
    });

    // 2. Cari semua yang overdue untuk di-release device-nya
    const overdueList = await prisma.peminjaman.findMany({
      where: {
        status: "approved",
        dueAt: { lt: now },
      },
      select: { id: true, deviceId: true }
    });

    if (overdueList.length > 0) {
      const ids = overdueList.map(item => item.id);
      const deviceIds = overdueList.map(item => item.deviceId);

      await prisma.$transaction([
        prisma.peminjaman.updateMany({
          where: { id: { in: ids } },
          data: { status: "returned" }
        }),
        prisma.device.updateMany({
          where: { id: { in: deviceIds } },
          data: { isAvailable: true }
        })
      ]);
    }
  } catch (error) {
    console.error("Gagal melakukan otomatisasi data overdue:", error);
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  // Upsert user yang sedang login saat ini agar datanya sinkron dengan Clerk
  const user = await prisma.user.upsert({
    where: { clerkId: userId! },
    update: {},
    create: {
      clerkId: userId!,
      email: clerkUser!.emailAddresses[0].emailAddress,
      name: clerkUser!.fullName || "",
    },
  });

  const now = new Date();

  // Jalankan worker pembersihan data overdue di background
  bersihkanDataOverdue(now);

  // KUNCI UTAMA GLOBAL: Hapus filter 'userId: user.id' pada query statistik & riwayat
  const [
    overdueItems,
    total,
    pending,
    approved,
    rejected,
    recent
  ] = await Promise.all([
    prisma.peminjaman.findMany({
      where: {
        userId: user.id, // Khusus alert pengingat telat mengembalikan, tetap kunci milik user ini saja
        status: "returned",
        dueAt: {
          lt: now,
          gt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        },
      },
      include: { device: true },
      orderBy: { dueAt: "desc" },
    }),
    
    // 1. Hitung TOTAL peminjaman dari SEMUA USER di database
    prisma.peminjaman.count(), 

    // 2. Hitung semua yang LAGI DIPROSES dari SEMUA USER
    prisma.peminjaman.count({ 
      where: { status: "pending" } 
    }),

    // 3. Hitung semua yang STATUSNYA APPROVED dari SEMUA USER
    prisma.peminjaman.count({ 
      where: { status: "approved" } 
    }),

    // 4. Hitung semua yang STATUSNYA REJECTED dari SEMUA USER
    prisma.peminjaman.count({ 
      where: { status: "rejected" } 
    }),
    
    // 5. Ambil 5 riwayat terbaru lintas user agar user 1 bisa memantau aktivitas user 2
    prisma.peminjaman.findMany({
      include: { user: true, device: true },
      take: 5,
      orderBy: { createdAt: "desc" },
    })
  ]);

  return (
    <div className="space-y-8 text-black">
      {/* Alert Overdue */}
      <OverdueAlert
        items={overdueItems.map((item) => ({
          id: item.id,
          deviceName: item.device.name,
          dueAt: item.dueAt?.toLocaleString("id-ID") ?? "",
        }))}
      />

      {/* Welcome */}
      <div className="rounded-3xl bg-blue-600 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Hai, {user.name ?? "User"}
        </h1>
        <p className="mt-2 text-blue-100">
          Selamat datang di Sistem Peminjaman Device
        </p>
      </div>

      {/* Statistik Global */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-gray-500 font-medium">Total</p>
          <h2 className="mt-2 text-3xl font-bold">{total}</h2>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-6 shadow-sm border border-yellow-100">
          <p className="text-sm text-yellow-700 font-medium">Lagi diproses</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-700">{pending}</h2>
        </div>

        <div className="rounded-2xl bg-green-50 p-6 shadow-sm border border-green-100">
          <p className="text-sm text-green-700 font-medium">Approved</p>
          <h2 className="mt-2 text-3xl font-bold text-green-700">{approved}</h2>
        </div>

        <div className="rounded-2xl bg-red-50 p-6 shadow-sm border border-red-100">
          <p className="text-sm text-red-700 font-medium">Rejected</p>
          <h2 className="mt-2 text-3xl font-bold text-red-700">{rejected}</h2>
        </div>
      </div>

      {/* Riwayat Terbaru Global */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Riwayat Terbaru</h2>
          {/* Terhubung langsung ke halaman Riwayat Semua */}
          <Link href="/riwayat-admin" className="text-sm font-semibold text-blue-500 hover:underline">
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-4">
          {recent.length === 0 ? (
            <p className="text-gray-500">Belum ada pengajuan</p>
          ) : (
            recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition-colors"
              >
<div>
  <h3 className="font-semibold text-black">
    {item.device.name} - <span className="text-blue-600">{item.user.name}</span>
  </h3>
  
  {/* OPTIMASI: Memotong teks keperluan jika terlalu panjang */}
  <p className="text-sm text-gray-500 max-w-md md:max-w-xl break-words">
    {item.purpose.length > 60 
      ? `${item.purpose.substring(0, 60)}...` 
      : item.purpose
    }
  </p>
</div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    item.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : item.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : item.status === "returned"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Action */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border">
        <h2 className="mb-4 text-xl font-bold">Quick Action</h2>
        <Link
          href="/pengajuan"
          className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          + Ajukan Peminjaman
        </Link>
      </div>
    </div>
  );
}
