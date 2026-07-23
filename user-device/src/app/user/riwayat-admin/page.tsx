import { prisma } from "@/lib/prisma";
import FilterRiwayatAdmin from "../../../components/FilterRiwayatAdmin";

interface PageProps {
  searchParams: Promise<{ status?: string; deviceId?: string; range?: string }>;
}

export default async function RiwayatAdminPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Ambil opsi device untuk dropdown filter
  const devices = await prisma.device.findMany({
    select: { id: true, name: true },
  });

  // Logika filter tanggal berdasarkan pilihan dropdown 'range'
  let dateFilter = {};
  const now = new Date();

  if (params.range === "hari-ini") {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateFilter = { gte: startOfToday };
  } else if (params.range === "minggu-ini") {
    // Menghitung mundur 7 hari ke belakang
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    dateFilter = { gte: sevenDaysAgo };
  } else if (params.range === "bulan-ini") {
    // Menghitung mundur sejak tanggal 1 di bulan berjalan saat ini
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    dateFilter = { gte: startOfMonth };
  }

  // Ambil data peminjaman berdasarkan filter gabungan status, device, dan waktu
  const semuaRiwayat = await prisma.peminjaman.findMany({
    where: {
      ...(params.status && { status: params.status }),
      ...(params.deviceId && { deviceId: params.deviceId }),
      ...(params.range && { createdAt: dateFilter }), // Terapkan filter waktu jika dipilih
    },
    include: {
      user: true,
      device: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Riwayat Semua Peminjaman</h1>

      {/* Komponen filter interaktif */}
      <FilterRiwayatAdmin 
        devices={devices} 
        currentStatus={params.status} 
        currentDeviceId={params.deviceId} 
        currentRange={params.range}
      />

      {/* Tabel Data */}
      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm text-black">
        {semuaRiwayat.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">Tidak ada riwayat peminjaman yang cocok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-sm font-semibold text-gray-600">
                  <th className="p-4">Peminjam</th>
                  <th className="p-4">Device</th>
                  <th className="p-4">Keperluan</th>
                  <th className="p-4">Waktu</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {semuaRiwayat.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium">
                      {item.user.name}
                      <br/>
                      <span className="text-xs text-gray-400">{item.user.email}</span>
                    </td>
                    <td className="p-4 font-medium">{item.device.name}</td>
                    {/* Mengaplikasikan potongan teks truncate juga di tabel riwayat agar rapi */}
                    <td className="p-4 text-gray-600 max-w-xs break-words">
                      {item.purpose.length > 50 ? `${item.purpose.substring(0, 50)}...` : item.purpose}
                    </td>
                    <td className="p-4 text-gray-500">
                      {new Date(item.borrowDate).toLocaleDateString("id-ID")}
                      <br/>
                      <span className="text-xs">{item.borrowTime} - {item.returnTime}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        item.status === 'returned' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
