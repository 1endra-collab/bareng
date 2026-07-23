import Image from "next/image";
import { Laptop } from "@/lib/dummy-data";

interface Props {
  laptop: Laptop;
  onSelect: (laptop: Laptop) => void;
}

export default function LaptopCard({ laptop, onSelect }: Props) {
  const tersedia = laptop.status === "tersedia";

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition">
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={laptop.image}
          alt={laptop.nama}
          fill
          className="object-contain p-4"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{laptop.nama}</h3>

        <div className="text-sm text-gray-500 mt-1 space-y-0.5">
          <p>RAM {laptop.ram} · {laptop.cpu}</p>
          <p>{laptop.lokasi} · {laptop.kelas}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              tersedia
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {tersedia ? "🟢 Tersedia" : "🔴 Dipinjam"}
          </span>

          <button
            disabled={!tersedia}
            onClick={() => onSelect(laptop)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
              tersedia
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {tersedia ? "Pesan" : "Detail"}
          </button>
        </div>
      </div>
    </div>
  );
}