"use client";

import { Clue } from "@/src/domain/types";

export default function ClueBoard({
  clues,
  phase,
}: {
  clues: Clue[];
  phase: number;
}) {
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
      <div className="border-2 border-dashed border-[#bdb7bd] bg-[#f4efe4] p-5 text-center">

        <div className="mx-auto mb-2 flex h-10 w-10 rotate-[-4deg] items-center justify-center border-2 border-[#17151a] bg-[#f7c948] font-display text-lg shadow-[2px_2px_0_#17151a]">
          ?
        </div>

        <p className="font-display text-xs uppercase tracking-[0.12em] text-[#817a82]">
          No clues yet
        </p>

        <p className="mt-1 text-[11px] font-semibold text-[#a09aa0]">
          Clues will appear as players submit them.
        </p>

      </div>
    );
  }

  return (
    <div className="max-h-[50vh] space-y-5 overflow-y-auto sm:p-1 lg:max-h-[60vh]">

      {/* Board title */}
      <div className="flex items-center justify-between border-b-2 border-[#17151a] pb-2">

        <div>
          <p className="font-display text-[11px] uppercase tracking-[0.18em] text-[#817a82]">
            Evidence board
          </p>

          <p className="font-display text-lg uppercase">
            Clues
          </p>
        </div>

        <div className="rotate-2 border-2 border-[#17151a] bg-[#ef6b73] px-2 py-1 font-display text-[9px] uppercase shadow-[2px_2px_0_#17151a]">
          Phase {phase}
        </div>

      </div>

      {rounds
        .slice()
        .reverse()
        .map((round, roundIndex) => (
          <div key={round}>

            {/* Round label */}
            <div className="mb-3 flex items-center gap-2">

              <span className="font-display text-[10px] uppercase tracking-[0.15em] text-[#817a82]">
                Round {round}
              </span>

              <div className="h-px flex-1 bg-[#c9c3c9]" />

            </div>

            {/* Clue notes */}
            <div className="flex flex-wrap gap-3">

              {byRound.get(round)!.map((c, idx) => {

                const rotations = [
                  "rotate-[-2deg]",
                  "rotate-[1deg]",
                  "rotate-[2deg]",
                  "rotate-[-1deg]",
                ];

                const rotation =
                  rotations[(idx + roundIndex) % rotations.length];

                const noteColors = [
                  "bg-[#f7c948]",
                  "bg-[#fffdf8]",
                  "bg-[#dfe8ff]",
                  "bg-[#ffe0df]",
                ];

                const noteColor =
                  noteColors[(idx + round) % noteColors.length];

                return (
                  <div
                    key={c.playerId + round + idx}
                    className={`
                      ${rotation}
                      ${noteColor}
                      min-w-[100px]
                      max-w-[160px]
                      border-2
                      border-[#17151a]
                      px-3
                      py-2.5
                      shadow-[3px_3px_0_#17151a]
                    `}
                  >

                    <div className="font-display text-sm font-bold">
                      {c.word}
                    </div>

                    <div className="mt-1 truncate text-[10px] font-semibold text-[#5f5960]">
                      {c.playerName}
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        ))}

    </div>
  );
}