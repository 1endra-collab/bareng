"use client";

import { useTransition } from "react";
import { kembalikanPerangkatAwal } from "@/actions/pengajuan";

export default function TombolKembalikan({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleReturn = () => {
    if (confirm("Apakah kamu yakin ingin mengembalikan perangkat ini sekarang?")) {
      startTransition(async () => {
        // GANTI BLOK CATCH DI FILE TombolKembalikan.tsx MENJADI SEPERTI INI:

      try {
        await kembalikanPerangkatAwal(id);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // KUNCI UTAMA: Jika error disebabkan oleh redirect bawaan Next.js, abaikan saja
          if (error.message.includes("NEXT_REDIRECT")) return;
          alert(error.message);
        } else {
          alert("Terjadi kesalahan sistem saat mengembalikan perangkat.");
        }
      }

      });
    }
  };

  return (
    <button
      onClick={handleReturn}
      disabled={isPending}
      className={`mt-3 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all ${
        isPending 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"
      }`}
    >
      {isPending ? "Memproses..." : "↩️ Kembalikan Sekarang"}
    </button>
  );
}
