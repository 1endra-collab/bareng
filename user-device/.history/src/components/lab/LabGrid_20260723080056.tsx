
import { labs } from "@/lib/dummy-data";
import LabCard from "./LabCard";

export default function LabGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-16 max-w-5xl mx-auto">
      {labs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
    </div>
  );
}