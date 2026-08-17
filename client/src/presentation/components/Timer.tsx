"use client";

import { useEffect, useState } from "react";

export default function Timer({
  endsAt,
  totalSeconds,
  label,
}: {
  endsAt: number | null;
  totalSeconds: number;
  label: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  if (!endsAt) return null;

  const remainingMs = Math.max(0, endsAt - now);
  const remainingSec = Math.ceil(remainingMs / 1000);
  const pct = Math.max(0, Math.min(100, (remainingMs / (totalSeconds * 1000)) * 100));
  const urgent = remainingSec <= 5;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-display text-[11px] tracking-[0.2em] uppercase text-paper-dim">
          {label}
        </span>
        <span
          className={`font-display text-lg tabular-nums ${
            urgent ? "text-alarm fuse-warning" : "text-lamp"
          }`}
        >
          {remainingSec}s
        </span>
      </div>
      <div className="h-2 w-full bg-ink-raised border border-line overflow-hidden">
        <div
          className={`h-full transition-[width] duration-200 ease-linear ${
            urgent ? "bg-alarm" : "bg-lamp"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
