import Link from "next/link";

import { prisma } from "@/lib/prisma";

import { auth } from "@clerk/nextjs/server";

import { deletePeminjaman } from "@/actions/pengajuan";

export default async function RiwayatPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId!,
    },
  });

  const peminjaman =
    await prisma.peminjaman.findMany({
      where: {
        userId: user?.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Riwayat Peminjaman
      </h1>

      <div className="space-y-4">
        {peminjaman.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
            Belum ada pengajuan
          </div>
        ) : (
          peminjaman.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-4"
            >
              <h2 className="text-xl font-semibold">
                {item.deviceName}
              </h2>

              <p className="text-gray-500">
                {item.purpose}
              </p>

              <div className="mt-2 text-sm">
                <p>
                  Tanggal:
                  {" "}
                  {item.borrowDate.toLocaleDateString()}
                </p>

                <p>
                  Jam:
                  {" "}
                  {item.borrowTime}
                </p>

                <p>
                  Status:
                  {" "}
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
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
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                {/* EDIT */}
                <Link
                  href={`/riwayat/${item.id}`}
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
                >
                  Edit
                </Link>

                {/* DELETE */}
                <form
                  action={async () => {
                    "use server";

                    await deletePeminjaman(
                      item.id
                    );
                  }}
                >
                  <button className="rounded-lg bg-red-500 px-4 py-2 text-white">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}