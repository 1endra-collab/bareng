import Link from "next/link";
import { Monitor } from "lucide-react";
import { Lab } from "@/lib/dummy-data";

export default function LabCard({ lab }: { lab: Lab }) {
  return (
    <Link
      href={`/user/lab/${lab.id}`}
      className="bg-white rounded-2xl border shadow-sm p-8 hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      <Monitor size={56} className="mx-auto text-blue-600" />

      <h2 className="text-xl font-bold text-center mt-4">{lab.nama}</h2>

      <p className="text-center text-gray-500 text-sm mt-1">
        {lab.totalKomputer} unit komputer
      </p>
    </Link>
  );
}