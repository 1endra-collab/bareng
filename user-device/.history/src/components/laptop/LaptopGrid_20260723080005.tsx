import { laptops } from "@/lib/dummy-data";
import LaptopCard from "./LaptopCard";

export default function LaptopGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-16 max-w-7xl mx-auto">
      {laptops.map((laptop) => (
        <LaptopCard key={laptop.id} laptop={laptop} />
      ))}
    </div>
  );
}