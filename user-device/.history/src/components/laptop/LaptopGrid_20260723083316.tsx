"use client";

import { useState } from "react";
import { laptops, Laptop } from "@/lib/dummy-data";
import LaptopCard from "./LaptopCard";
import BookingModal, { BookingFormData } from "@/components/booking/BookingModal";

export default function LaptopGrid() {
  const [selectedLaptop, setSelectedLaptop] = useState<Laptop | null>(null);

  function handleSubmit(data: BookingFormData) {
    console.log("Booking laptop:", {
      laptop: selectedLaptop?.nama,
      ...data,
    });

    // nanti diganti: fetch("/api/booking", { method: "POST", ... })
    alert(`Berhasil booking ${selectedLaptop?.nama}`);
    setSelectedLaptop(null);
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6 pb-16 max-w-7xl mx-auto">
        {laptops.map((laptop) => (
          <LaptopCard key={laptop.id} laptop={laptop} onSelect={setSelectedLaptop} />
        ))}
      </div>

      <BookingModal
        isOpen={selectedLaptop !== null}
        onClose={() => setSelectedLaptop(null)}
        title={`Booking ${selectedLaptop?.nama ?? ""}`}
        subtitle="Isi data peminjaman"
        onSubmit={handleSubmit}
      />
    </>
  );
}