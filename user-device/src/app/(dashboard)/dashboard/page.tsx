import { prisma } from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";

import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId!,
    },
  });

  const total =
    await prisma.peminjaman.count({
      where: {
        userId: user?.id,
      },
    });

  const pending =
    await prisma.peminjaman.count({
      where: {
        userId: user?.id,
        status: "pending",
      },
    });

  const approved =
    await prisma.peminjaman.count({
      where: {
        userId: user?.id,
        status: "approved",
      },
    });

  const rejected =
    await prisma.peminjaman.count({
      where: {
        userId: user?.id,
        status: "rejected",
      },
    });

  const recent =
    await prisma.peminjaman.findMany({
      where: {
        userId: user?.id,
      },

      take: 5,

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="rounded-3xl bg-blue-600 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Hai, Farlay
        </h1>

        <p className="mt-2 text-blue-100">
          Selamat datang di Sistem
          Peminjaman Device
        </p>
      </div>

      {/* Statistik */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {total}
          </h2>
        </div>

        <div className="rounded-2xl bg-yellow-50 p-6 shadow-sm">
          <p className="text-sm text-yellow-700">
            sabar nanti dulu
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-700">
            {pending}
          </h2>
        </div>

        <div className="rounded-2xl bg-green-50 p-6 shadow-sm">
          <p className="text-sm text-green-700">
            Approved
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {approved}
          </h2>
        </div>

        <div className="rounded-2xl bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-700">
            Rejected
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-700">
            {rejected}
          </h2>
        </div>
      </div>

      {/* Riwayat */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Riwayat Terbaru
          </h2>

          <Link
            href="/riwayat"
            className="text-sm text-blue-500"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-4">
          {recent.length === 0 ? (
            <p className="text-gray-500">
              Belum ada pengajuan
            </p>
          ) : (
            recent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {item.deviceId}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.purpose}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    item.status ===
                    "approved"
                      ? "bg-green-100 text-green-700"
                      : item.status ===
                          "rejected"
                        ? "bg-red-100 text-red-700"
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
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">
          Quick Action
        </h2>

        <Link
          href="/pengajuan"
          className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          + Ajukan Peminjaman
        </Link>
      </div>
    </div>
  );
}