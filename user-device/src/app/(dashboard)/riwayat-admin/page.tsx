import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RiwayatAdminPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId!,
    },
  });

  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  const peminjaman =
    await prisma.peminjaman.findMany({
      include: {
        user: true,
        device: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

return (
  <div>
    <h1 className="mb-6 text-3xl font-bold">
      Riwayat Semua Peminjaman
    </h1>

    <div className="space-y-4">
      {peminjaman.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          Belum ada riwayat peminjaman
        </div>
      ) : (
        peminjaman.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {item.device.name}
                </h2>

                <p className="mt-1 text-gray-500">
                  {item.purpose}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  item.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : item.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <p>
                <span className="font-semibold">
                  Peminjam:
                </span>{" "}
                {item.user.name}
              </p>

              <p>
                <span className="font-semibold">
                  Email:
                </span>{" "}
                {item.user.email}
              </p>

              <p>
                <span className="font-semibold">
                  Tanggal:
                </span>{" "}
                {item.borrowDate.toLocaleDateString()}
              </p>

              <p>
                <span className="font-semibold">
                  Jam:
                </span>{" "}
                {item.borrowTime}
                {item.returnTime &&
                  ` - ${item.returnTime}`}
              </p>
            </div>

            {item.note && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="font-semibold">
                  Catatan Admin
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {item.note}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </div>
);
}