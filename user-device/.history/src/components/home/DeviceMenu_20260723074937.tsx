import DeviceCard from "DeviceCard";

export default function DeviceMenu() {
  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6 pb-12">

      <DeviceCard
        href="/user/laptop"
        icon="💻"
        title="Laptop"
        description="Lihat semua laptop yang tersedia"
      />

      <DeviceCard
        href="/user/lab"
        icon="🖥️"
        title="Laboratorium"
        description="Pilih Lab lalu pilih posisi komputer"
      />

    </div>
  );
}