"use client";

import { useState } from "react";

export default function CaseHeader({
  code,
  phase,
  round,
  roundsThisPhase,
  status,
}: {
  code: string;
  phase: number;
  round: number;
  roundsThisPhase: number;
  status: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <header className="mb-5 flex items-center justify-between gap-3 border-b-2 border-[#17151a] pb-3 sm:mb-6">

      {/* Left */}
      <div className="flex min-w-0 items-center gap-3">

        <div className="hidden h-10 w-10 rotate-[-3deg] items-center justify-center border-2 border-[#17151a] bg-[#f7c948] font-display text-sm shadow-[3px_3px_0_#17151a] sm:flex">
          ?
        </div>

        <div className="min-w-0">
          <h1 className="font-display text-sm uppercase tracking-[0.15em] text-[#17151a] sm:text-base">
            Sojho or Fatah
          </h1>

          {status !== "lobby" && status !== "ended" && (
            <p className="mt-0.5 text-[11px] font-semibold text-[#817a82] sm:text-xs">
              Phase {phase} · Round {round}/{roundsThisPhase}
            </p>
          )}
        </div>

      </div>

      {/* Room code */}
      <button
        onClick={copy}
        type="button"
        className="
          shrink-0
          border-2
          border-[#17151a]
          bg-[#fffdf8]
          px-3
          py-2
          font-display
          text-[10px]
          uppercase
          tracking-[0.12em]
          shadow-[3px_3px_0_#17151a]
          transition-all
          hover:bg-[#f7c948]
          active:translate-x-[2px]
          active:translate-y-[2px]
          active:shadow-[1px_1px_0_#17151a]
          sm:px-4
          sm:text-xs
        "
      >
        {copied ? "COPIED!" : `CODE: ${code}`}
      </button>

    </header>
  );
}