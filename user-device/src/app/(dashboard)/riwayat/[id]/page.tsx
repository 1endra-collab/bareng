import { prisma } from "@/lib/prisma";

import { updatePeminjaman } from "@/actions/pengajuan";

export default async function EditPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const data = await prisma.peminjaman.findUnique({
    where: {
      id,
    },
  });

  if (!data) {
    return <div>Data tidak ditemukan</div>;
  }

  const updateData = async (
    formData: FormData
  ) => {
    "use server";

    await updatePeminjaman(
      id,
      formData
    );
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        Edit Pengajuan
      </h1>

      <form
        action={updateData}
        className="space-y-4"
      >
        <input
          type="text"
          name="deviceName"
          defaultValue={data.deviceId}
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="purpose"
          defaultValue={data.purpose}
          className="w-full rounded-lg border p-3"
        />

        <input
          type="date"
          name="borrowDate"
          defaultValue={
            data.borrowDate
              .toISOString()
              .split("T")[0]
          }
          className="w-full rounded-lg border p-3"
        />

        <input
          type="time"
          name="borrowTime"
          defaultValue={data.borrowTime}
          className="w-full rounded-lg border p-3"
        />

        <button className="rounded-lg bg-blue-500 px-5 py-3 text-white">
          Update
        </button>
      </form>
    </div>
  );
}