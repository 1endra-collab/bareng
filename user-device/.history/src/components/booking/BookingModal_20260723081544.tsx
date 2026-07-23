"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  onSubmit: (data: BookingFormData) => void;
}

export interface BookingFormData {
  nama: string;
  kelas: string;
  tanggalPinjam: string;
  tanggalKembali: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  title,
  subtitle,
  onSubmit,
}: BookingModalProps) {
  const [form, setForm] = useState<BookingFormData>({
    nama: "",
    kelas: "",
    tanggalPinjam: "",
    tanggalKembali: "",
  });

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">
              Nama Peminjam
            </label>
            <input
              required
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama lengkap"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Kelas</label>
            <input
              required
              name="kelas"
              value={form.kelas}
              onChange={handleChange}
              placeholder="Contoh: XI SIJA"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">
                Tanggal Pinjam
              </label>
              <input
                required
                type="date"
                name="tanggalPinjam"
                value={form.tanggalPinjam}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Tanggal Kembali
              </label>
              <input
                required
                type="date"
                name="tanggalKembali"
                value={form.tanggalKembali}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            Konfirmasi Booking
          </button>
        </form>
      </div>
    </div>
  );
}