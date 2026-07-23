import Link from "next/link";
import { ReactNode } from "react";

interface DeviceCardProps {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export default function DeviceCard({
  href,
  title,
  description,
  icon,
}: DeviceCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border bg-white p-10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
    >
      <div className="flex justify-center text-7xl">{icon}</div>

      <h2 className="mt-6 text-center text-3xl font-bold">
        {title}
      </h2>

      <p className="mt-3 text-center text-gray-500">
        {description}
      </p>
    </Link>
  );
}