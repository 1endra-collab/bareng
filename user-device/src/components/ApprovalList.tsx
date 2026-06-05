"use client";

import { useTransition } from "react";
import { approvePeminjaman, rejectPeminjaman } from "@/actions/approval";

interface PengajuanItem {
  id: string;
  purpose: string;
  borrowDate: Date;
  borrowTime: string;
  returnTime: string | null;
  user: { name: string | null; email: string };
  device: { name: string };
}

export default function ApprovalList({ pengajuan }: { pengajuan: PengajuanItem[] }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    if (isPending) return;
    startTransition(async () => {
      await approvePeminjaman(id);
    });
  };

  const handleReject = (formData: FormData, id: string) => {
    if (isPending) return;
    const note = formData.get("note") as string;
    startTransition(async () => {
      await rejectPeminjaman(id, note);
    });
  };

  if (pengajuan.length === 0) {
    return <div className="rounded-xl bg-white p-6 shadow-sm">Tidak ada pengajuan pending</div>;
  }

  return (
    <div className="space-y-4">
      {pengajuan.map((item) => (
        <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">{item.device.name}</h2>
          <p><strong>Peminjam:</strong> {item.user.name}</p>
          <p><strong>Email:</strong> {item.user.email}</p>
          <p><strong>Keperluan:</strong> {item.purpose}</p>
          <p><strong>Tanggal:</strong> {new Date(item.borrowDate).toLocaleDateString()}</p>
          <p><strong>Jam:</strong> {item.borrowTime}{item.returnTime && ` - ${item.returnTime}`}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            {/* FORM APPROVE */}
            <button
              onClick={() => handleApprove(item.id)}
              disabled={isPending}
              className={`rounded-lg px-4 py-2 text-white font-medium transition-all ${
                isPending ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPending ? "Memproses..." : "Approve"}
            </button>

            {/* FORM REJECT */}
            <form action={(fd) => handleReject(fd, item.id)} className="flex gap-2">
              <input
                type="text"
                name="note"
                placeholder="Alasan penolakan..."
                className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100"
                required
                disabled={isPending}
              />
              <button
                type="submit"
                disabled={isPending}
                className={`rounded-lg px-4 py-2 text-white font-medium transition-all ${
                  isPending ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Reject
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
