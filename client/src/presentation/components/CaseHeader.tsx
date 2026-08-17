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
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  return (
    <header className="flex items-center justify-between gap-3 border-b border-line pb-3 mb-4 sm:mb-6">
      <div>
        <h1 className="font-display text-sm sm:text-base tracking-[0.15em] uppercase text-lamp">
          Sojho or Fatah
        </h1>
        {status !== "lobby" && status !== "ended" && (
          <p className="text-[11px] sm:text-xs text-paper-dim mt-0.5">
            Phase {phase} · Round {round}/{roundsThisPhase}
          </p>
        )}
      </div>
      <button
        onClick={copy}
        className="font-display text-xs sm:text-sm tracking-[0.15em] border border-line px-3 py-1.5 hover:border-lamp transition-colors shrink-0"
      >
        {copied ? "COPIED" : `CODE: ${code}`}
      </button>
    </header>
  );
}
