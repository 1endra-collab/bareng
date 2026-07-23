import { labs, getKomputerByLab } from "@/lib/dummy-data";
import DenahLab from "@/components/lab/DenahLab";
import { notFound } from "next/navigation";

export default async function DenahLabPage({
  params,
}: {
  params: Promise<{ labId: string }>;
}) {
  const { labId } = await params;
  const lab = labs.find((l) => l.id === labId);

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

      <DenahLab lab={lab} komputer={komputer} />
    </div>
  );
}