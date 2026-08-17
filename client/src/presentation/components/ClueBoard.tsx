"use client";

import { Clue } from "@/src/domain/types";

export default function ClueBoard({ clues, phase }: { clues: Clue[]; phase: number }) {
  const thisPhase = clues.filter((c) => c.phase === phase);
  const byRound = new Map<number, Clue[]>();
  thisPhase.forEach((c) => {
    const arr = byRound.get(c.round) ?? [];
    arr.push(c);
    byRound.set(c.round, arr);
  });
  const rounds = Array.from(byRound.keys()).sort((a, b) => a - b);

  if (rounds.length === 0) {
    return (
      <div className="case-card p-4 text-sm text-paper-dim italic">
        Clues will appear here as players submit them.
      </div>
    );
  }

  return (
    <div className="case-card p-3 sm:p-4 space-y-4 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
      {rounds
        .slice()
        .reverse()
        .map((round) => (
          <div key={round}>
            <div className="font-display text-[11px] tracking-[0.2em] uppercase text-paper-dim mb-2">
              Round {round}
            </div>
            <div className="flex flex-wrap gap-2">
              {byRound.get(round)!.map((c, idx) => (
                <div
                  key={c.playerId + round + idx}
                  className="tape bg-paper text-ink px-3 py-1.5 text-sm shadow-[2px_3px_0_rgba(0,0,0,0.35)] -rotate-1 first:rotate-1"
                >
                  <span className="font-semibold">{c.word}</span>
                  <span className="block text-[10px] text-ink/60 mt-0.5">
                    {c.playerName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
