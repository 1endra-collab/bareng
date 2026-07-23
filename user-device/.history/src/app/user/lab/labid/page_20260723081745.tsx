"use client";

import { useState } from "react";
import { KomputerSlot, Lab } from "@/lib/dummy-data";
import ComputerSlot from "@components/lab/Comput";
import BookingModal, { BookingFormData } from "@/components/booking/BookingModal";

export default function DenahLab({
  lab,
  komputer,
}: {
  lab: Lab;
  komputer: KomputerSlot[];
}) {
  const [selectedSlot, setSelectedSlot] = useState<KomputerSlot | null>(null);

  function handleSubmit(data: BookingFormData) {
    console.log("Booking:", {
      lab: lab.nama,
      pc: selectedSlot?.nomor,
      ...data,
    });

    // nanti diganti: kirim ke API / prisma.booking.create
    alert(`Berhasil booking ${lab.nama} - PC ${selectedSlot?.nomor}`);
    setSelectedSlot(null);
  }

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-10">
        {komputer.map((slot) => (
          <ComputerSlot key={slot.id} slot={slot} onSelect={setSelectedSlot} />
        ))}
      </div>

      <BookingModal
        isOpen={selectedSlot !== null}
        onClose={() => setSelectedSlot(null)}
        title={`Booking PC ${selectedSlot?.nomor ?? ""}`}
        subtitle={`${lab.nama} · Isi data peminjaman`}
        onSubmit={handleSubmit}
      />
    </>
  );
}