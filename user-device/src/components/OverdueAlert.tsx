"use client";

import { useEffect } from "react";

export default function OverdueAlert({
  items,
}: {
  items: { id: string; deviceName: string; dueAt: string }[];
}) {
  useEffect(() => {
    if (items.length > 0) {
      // suara notif pakai Web Audio API
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-red-300 bg-red-100 p-5 text-red-700">
      <p className="text-lg font-bold">⚠️ Peminjaman Kamu Sudah Lewat Waktu!</p>
      <ul className="mt-2 space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            🖥️ {item.deviceName} — batas: {item.dueAt}
          </li>
        ))}
      </ul>
    </div>
  );
}