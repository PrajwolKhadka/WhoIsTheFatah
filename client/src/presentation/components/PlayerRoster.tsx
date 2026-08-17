"use client";

import { PublicPlayer } from "@/src/domain/types";

export default function PlayerRoster({
  players,
  selfId,
  fatahId,
  submittedIds,
  compact,
}: {
  players: PublicPlayer[];
  selfId: string;
  fatahId?: string | null;
  submittedIds?: Set<string>;
  compact?: boolean;
}) {
  return (
    <div className="case-card p-3 sm:p-4">
      <div className="font-display text-[11px] tracking-[0.2em] uppercase text-paper-dim mb-3">
        Suspects — {players.filter((p) => !p.eliminated && !p.left).length} active
      </div>
      <ul className="space-y-1.5">
        {players.map((p, i) => {
          const isFatahRevealed = fatahId === p.id;
          const submitted = submittedIds?.has(p.id);
          const isOut = p.eliminated || p.left;
          return (
            <li
              key={p.id}
              className={`flex items-center justify-between gap-2 px-2.5 py-2 border ${
                isOut
                  ? "border-line/50 bg-ink-raised/40 opacity-45"
                  : isFatahRevealed
                  ? "border-alarm bg-alarm-dim/30"
                  : "border-line bg-ink-raised/60"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-display text-xs text-paper-dim w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`truncate text-sm ${
                    isOut ? "line-through" : ""
                  } ${p.id === selfId ? "font-semibold text-lamp" : "text-paper"}`}
                >
                  {p.name}
                  {p.id === selfId ? " (you)" : ""}
                  {p.isHost ? " · host" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {p.left ? (
                  <span className="text-[10px] font-display text-paper-dim uppercase">
                    left
                  </span>
                ) : (
                  !p.connected && (
                    <span className="text-[10px] font-display text-paper-dim uppercase">
                      offline
                    </span>
                  )
                )}
                {isFatahRevealed && (
                  <span className="text-[10px] font-display text-alarm uppercase tracking-wide">
                    Fatah
                  </span>
                )}
                {!compact && submittedIds && !isOut && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      submitted ? "bg-lamp" : "bg-line"
                    }`}
                    title={submitted ? "Submitted" : "Waiting"}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
