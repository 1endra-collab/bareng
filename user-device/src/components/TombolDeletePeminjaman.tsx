"use client";

import { useTransition } from "react";
import { deletePeminjaman } from "@/actions/pengajuan";

export default function TombolDeletePeminjaman({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Apakah kamu yakin ingin membatalkan/menghapus pengajuan ini?")) {
      startTransition(async () => {
        // GANTI BLOK CATCH DI FILE TombolDeletePeminjaman.tsx MENJADI SEPERTI INI:

      try {
        await deletePeminjaman(id);
      } catch (error: unknown) {
        if (error instanceof Error) {
          // KUNCI UTAMA: Jika error disebabkan oleh redirect bawaan Next.js, abaikan saja
          if (error.message.includes("NEXT_REDIRECT")) return;
          alert(error.message);
        } else {
          alert("Gagal menghapus pengajuan.");
        }
      }

      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`rounded-lg px-4 py-2 text-sm text-white font-medium transition-all ${
        isPending 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-red-500 hover:bg-red-600 active:scale-[0.98]"
      }`}
    >
      {isPending ? "Menghapus..." : "Delete"}
    </button>
  );
}
