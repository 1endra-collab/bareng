"use client";

import { useTransition, useState } from "react";
import {
  approvePeminjaman,
  rejectPeminjaman,
} from "@/actions/approval";

interface PengajuanItem {
  id: string;
  purpose: string;
  borrowDate: Date;
  borrowTime: string;
  returnTime: string | null;
  user: {
    name: string | null;
    email: string;
  };
  device: {
    name: string;
  };
}

export default function ApprovalList({
  pengajuan,
}: {
  pengajuan: PengajuanItem[];
}) {
  const [isPending, startTransition] =
    useTransition();

  const [alertMessage, setAlertMessage] =
    useState<string | null>(null);

  const handleApprove = (
    id: string,
    note: string
  ) => {


    if (isPending) return;

    setAlertMessage(null);

    startTransition(async () => {
      try {
        await approvePeminjaman(id, note);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (
            error.message.includes(
              "NEXT_REDIRECT"
            )
          )
            return;

          setAlertMessage(error.message);
        } else {
          setAlertMessage(
            "Terjadi kesalahan sistem saat memproses approval."
          );
        }
      }
    });
  };

  const handleReject = (
    formData: FormData,
    id: string
  ) => {
    if (isPending) return;

    const note = formData.get(
      `note-${id}`
    ) as string;



    setAlertMessage(null);

    startTransition(async () => {
      try {
        await rejectPeminjaman(id, note);
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (
            error.message.includes(
              "NEXT_REDIRECT"
            )
          )
            return;

          setAlertMessage(error.message);
        } else {
          setAlertMessage(
            "Terjadi kesalahan sistem saat memproses reject."
          );
        }
      }
    });
  };

  if (pengajuan.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm border text-black">
        Tidak ada pengajuan pending
      </div>
    );
  }

  return (
    <div className="space-y-4 text-black">
      {alertMessage && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-200">
          ⚠️ {alertMessage}
        </div>
      )}

      {pengajuan.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <h2 className="text-xl font-semibold">
            {item.device.name}
          </h2>

          <p>
            <strong>Peminjam:</strong>{" "}
            {item.user.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {item.user.email}
          </p>

          <p>
            <strong>Keperluan:</strong>{" "}
            {item.purpose}
          </p>

          <p>
            <strong>Tanggal:</strong>{" "}
            {new Date(
              item.borrowDate
            ).toLocaleDateString("id-ID")}
          </p>

          <p>
            <strong>Jam:</strong>{" "}
            {item.borrowTime}
            {item.returnTime &&
              ` - ${item.returnTime}`}
          </p>

          <form
  action={(fd) => handleReject(fd, item.id)}
  className="mt-4 space-y-3"
>
  <div className="flex gap-2">
    <button
      type="button"
      onClick={() => {
        const textarea = document.querySelector(
          `textarea[name="note-${item.id}"]`
        ) as HTMLTextAreaElement;

        if (!textarea.value.trim()) {
          textarea.reportValidity();
          return;
        }

        handleApprove(
          item.id,
          textarea.value
        );
      }}
      disabled={isPending}
      className={`rounded-lg px-4 py-2 text-white font-medium transition-all ${
        isPending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {isPending
        ? "Memproses..."
        : "Approve"}
    </button>

    <button
      type="submit"
      disabled={isPending}
      className={`rounded-lg px-4 py-2 text-white font-medium transition-all ${
        isPending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      Reject
    </button>
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">
      Catatan Admin
    </label>

    <textarea
      name={`note-${item.id}`}
      placeholder="Masukkan catatan..."
      rows={3}
      required
      onInvalid={(e) =>
        e.currentTarget.setCustomValidity(
          "Please fill admin note."
        )
      }
      onInput={(e) =>
        e.currentTarget.setCustomValidity("")
      }
      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
      disabled={isPending}
    />
  </div>
</form>
        </div>
      ))}
    </div>
  );
}