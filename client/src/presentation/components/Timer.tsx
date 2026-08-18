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
    const id = setInterval(() => {
      setNow(Date.now());
    }, 200);

    return () => clearInterval(id);
  }, []);

  if (!endsAt) return null;

  const remainingMs = Math.max(0, endsAt - now);
  const remainingSec = Math.ceil(remainingMs / 1000);

  const pct = Math.max(
    0,
    Math.min(100, (remainingMs / (totalSeconds * 1000)) * 100)
  );

  const urgent = remainingSec <= 5;

  return (
    <div
      className={`
        border-2
        border-[#17151a]
        p-3
        shadow-[3px_3px_0_#17151a]
        ${
          urgent
            ? "bg-[#ef6b73]"
            : "bg-[#fffdf8]"
        }
      `}
    >

      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="font-display text-[10px] uppercase tracking-[0.17em] text-[#817a82]">
            Time left
          </p>

          <p className="mt-0.5 truncate font-display text-xs uppercase">
            {label}
          </p>

        </div>

        <div
          className={`
            shrink-0
            font-display
            text-2xl
            tabular-nums
            ${
              urgent
                ? "text-[#17151a]"
                : "text-[#5c8dff]"
            }
          `}
        >
          {remainingSec}s
        </div>

      </div>

      {/* Timer bar */}
      <div className="mt-3 h-3 w-full border-2 border-[#17151a] bg-[#f4efe4]">

        <div
          className={`
            h-full
            transition-[width]
            duration-200
            ease-linear
            ${
              urgent
                ? "bg-[#17151a]"
                : "bg-[#5c8dff]"
            }
          `}
          style={{
            width: `${pct}%`,
          }}
        />

      </div>

      {urgent && (
        <p className="mt-2 font-display text-[9px] uppercase tracking-[0.15em]">
          Hurry up!
        </p>
      )}

    </div>
  );
}