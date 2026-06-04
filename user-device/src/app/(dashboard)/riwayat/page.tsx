import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { deletePeminjaman } from "@/actions/pengajuan";

export default async function RiwayatPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: { clerkId: userId! },
  });

  const peminjaman = await prisma.peminjaman.findMany({
    where: { userId: user?.id },
    include: { device: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Riwayat Peminjaman</h1>

      <div className="space-y-4">
        {peminjaman.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
            Belum ada pengajuan
          </div>
        ) : (
          peminjaman.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-5 shadow-sm">
              
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold">{item.device.name}</h2>
                  <p className="text-sm text-gray-500">{item.purpose}</p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
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

              {/* Detail */}
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>📅 {item.borrowDate.toLocaleDateString("id-ID")}</p>
                <p>🕐 {item.borrowTime} — {item.returnTime}</p>
              </div>

              {/* Catatan Admin */}
              {item.note && (
                <div className="mt-3 rounded-lg bg-gray-50 p-3">
                  <p className="text-xs font-semibold text-gray-500">Catatan Admin</p>
                  <p className="text-sm text-gray-700">{item.note}</p>
                </div>
              )}

              {/* Tombol — hanya tampil kalau masih pending */}
              {item.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/riwayat/${item.id}`}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white"
                  >
                    Edit
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await deletePeminjaman(item.id);
                    }}
                  >
                    <button className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white">
                      Delete
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}