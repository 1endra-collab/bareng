import LabGrid from "@/components/lab/LabGrid";
import BackButton from "@/components/ui/BackButton";

export default function LabPage() {
  return (
    <div>
          <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 text-center">
              <b
        <h1 className="text-3xl font-bold">Pilih Laboratorium</h1>
        <p className="text-gray-500 mt-1">
          Pilih lab, lalu pilih posisi komputer yang tersedia
        </p>
      </div>

      <LabGrid />
    </div>
  );
}