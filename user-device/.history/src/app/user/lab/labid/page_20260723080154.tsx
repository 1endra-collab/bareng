import { labs, getKomputerByLab } from "@/lib/dummy-data";
import ComputerSlot from "@/components/lab/ComputerSlot";
import { notFound } from "next/navigation";

export default function DenahLabPage({
  params,
}: {
  params: { labId: string };
}) {
  const lab = labs.find((l) => l.id === params.labId);

  if (!lab) return notFound();

  const komputer = getKomputerByLab(lab.id);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
      <h1 className="text-3xl font-bold text-center">{lab.nama}</h1>
      <p className="text-gray-500 text-center mt-1">
        Klik posisi komputer yang tersedia
      </p>

      <div className="flex items-center justify-center gap-4 mt-6 text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-400 inline-block" /> Tersedia
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-400 inline-block" /> Dipinjam
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-10">
        {komputer.map((slot) => (
          <ComputerSlot key={slot.id} slot={slot} />
        ))}
      </div>
    </div>
  );
}