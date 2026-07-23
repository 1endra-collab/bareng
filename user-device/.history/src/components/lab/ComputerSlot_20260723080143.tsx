"use client";

import { KomputerSlot } from "@/lib/dummy-data";

export default function ComputerSlot({ slot }: { slot: KomputerSlot }) {
  const styleByStatus = {
    tersedia: "bg-green-100 border-green-400 text-green-700 hover:bg-green-200 cursor-pointer",
    dipinjam: "bg-red-100 border-red-300 text-red-600 cursor-not-allowed opacity-70",
    rusak: "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-70",
  };

  return (
    <button
      disabled={slot.status !== "tersedia"}
      className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs font-medium transition ${styleByStatus[slot.status]}`}
    >
      <span className="text-lg">🖥️</span>
      <span>PC {slot.nomor}</span>
    </button>
  );
}