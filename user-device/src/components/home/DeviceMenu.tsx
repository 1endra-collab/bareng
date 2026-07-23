import { Laptop, Monitor } from "lucide-react";
import DeviceCard from "./DeviceCard";

export default function DeviceMenu() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="grid gap-8 md:grid-cols-2">

        <DeviceCard
          href="/user/laptop"
          title="Laptop"
          description="Lihat daftar laptop yang tersedia"
          icon={<Laptop size={80} />}
        />

        <DeviceCard
          href="/user/lab"
          title="Laboratorium"
          description="Pilih laboratorium lalu pilih posisi komputer"
          icon={<Monitor size={80} />}
        />

      </div>
    </section>
  );
}