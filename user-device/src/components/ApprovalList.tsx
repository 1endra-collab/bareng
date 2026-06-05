"use client";

import { useTransition, useState } from "react";
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
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State untuk menampung pesan error bentrok

  
  const handleApprove = (id: string) => {
    if (isPending) return;
    setAlertMessage(null);

    startTransition(async () => {
      try {
        await approvePeminjaman(id);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // KUNCI UTAMA: Jika errornya cuma redirect bawaan Next.js, abaikan dan jangan tampilkan di alert
          if (error.message.includes("NEXT_REDIRECT")) return;
          setAlertMessage(error.message);
        } else {
          setAlertMessage("Terjadi kesalahan sistem saat memproses approval.");
        }
      }
    });
  };

  const handleReject = (formData: FormData, id: string) => {
    if (isPending) return;
    setAlertMessage(null);
    const note = formData.get("note") as string;

    startTransition(async () => {
      try {
        await rejectPeminjaman(id, note);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // KUNCI UTAMA: Jika errornya cuma redirect bawaan Next.js, abaikan dan jangan tampilkan di alert
          if (error.message.includes("NEXT_REDIRECT")) return;
          setAlertMessage(error.message);
        } else {
          setAlertMessage("Terjadi kesalahan sistem saat memproses reject.");
        }
      }
    });
  };

  if (pengajuan.length === 0) {
    return <div className="rounded-xl bg-white p-6 shadow-sm border text-black">Tidak ada pengajuan pending</div>;
  }

  return (
    <div className="space-y-4 text-black">
      {/* TAMPILKAN BANNER PERINGATAN JIKA TERJADI BENTROKAN DATA */}
      {alertMessage && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-200">
          ⚠️ {alertMessage}
        </div>
      )}

      {pengajuan.map((item) => (
        <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">{item.device.name}</h2>
          <p><strong>Peminjam:</strong> {item.user.name}</p>
          <p><strong>Email:</strong> {item.user.email}</p>
          <p><strong>Keperluan:</strong> {item.purpose}</p>
          <p><strong>Tanggal:</strong> {new Date(item.borrowDate).toLocaleDateString("id-ID")}</p>
          <p><strong>Jam:</strong> {item.borrowTime}{item.returnTime && ` - ${item.returnTime}`}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            {/* BUTTON APPROVE ANTI SPAM */}
            <button
              onClick={() => handleApprove(item.id)}
              disabled={isPending}
              className={`rounded-lg px-4 py-2 text-white font-medium transition-all ${
                isPending ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPending ? "Memproses..." : "Approve"}
            </button>

            {/* FORM REJECT ANTI SPAM */}
            <form action={(fd) => handleReject(fd, item.id)} className="flex gap-2">
              <input
                type="text"
                name="note"
                placeholder="Alasan penolakan..."
                className="rounded-lg border px-3 py-2 text-sm disabled:bg-gray-100 outline-none focus:border-blue-500"
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
