import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  approvePeminjaman,
  rejectPeminjaman,
} from "@/actions/approval";

export default async function ApprovalPage() {
  const { userId } = await auth();

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId!,
    },
  });

  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  const pengajuan =
    await prisma.peminjaman.findMany({
      where: {
        status: "pending",
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
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Approval Pengajuan
      </h1>

      <div className="space-y-4">
        {pengajuan.length === 0 ? (
          <div className="rounded-xl bg-white p-6">
            Tidak ada pengajuan pending
          </div>
        ) : (
          pengajuan.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-white p-4"
            >
              <h2 className="text-xl font-semibold">
                {item.device.name}
              </h2>

              <p>
                <strong>Peminjam:</strong>{" "}
                {item.user.name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {item.user.email}
              </p>

              <p>
                <strong>Keperluan:</strong>{" "}
                {item.purpose}
              </p>

              <p>
                <strong>Tanggal:</strong>{" "}
                {item.borrowDate.toLocaleDateString()}
              </p>

              <p>
                <strong>Jam:</strong>{" "}
                {item.borrowTime}
                {item.returnTime &&
                  ` - ${item.returnTime}`}
              </p>

              <div className="mt-4 flex gap-3">
                <form
                  action={async () => {
                    "use server";

                    await approvePeminjaman(
                      item.id
                    );
                  }}
                >
                  <button className="rounded-lg bg-green-500 px-4 py-2 text-white">
                    Approve
                  </button>
                </form>

<form
  action={async (formData) => {
    "use server";

    const note =
      formData.get("note") as string;

    await rejectPeminjaman(
      item.id,
      note
    );
  }}
  className="flex gap-2"
>
  <input
    type="text"
    name="note"
    placeholder="Alasan penolakan..."
    className="rounded-lg border px-3 py-2"
    required
  />

  <button className="rounded-lg bg-red-500 px-4 py-2 text-white">
    Reject
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