import { prisma } from "@/lib/prisma";
import FormPengajuan from "@/components/FormPengajuan";

export default async function PengajuanPage() {
  // Ambil data device langsung dari database di server side
  const devices = await prisma.device.findMany({
    where: {
      isAvailable: true,
    },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">
        Ajukan Peminjaman
      </h1>

      {/* Memanggil client component form dan mengoper data devices */}
      <FormPengajuan devices={devices} />
    </div>
  );
}
