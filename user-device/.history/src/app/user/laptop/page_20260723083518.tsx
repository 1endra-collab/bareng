import LaptopGrid from "@/components/laptop/LaptopGrid";
import BackButton from "@/components/ui/BackButton";

export default function LaptopPage() {
  return (
    <div>
          <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
              <BackButton></BackButton
        <h1 className="text-3xl font-bold">Daftar Laptop</h1>
        <p className="text-gray-500 mt-1">
          Pilih laptop yang ingin kamu pinjam
        </p>
      </div>

      <LaptopGrid />
    </div>
  );
}