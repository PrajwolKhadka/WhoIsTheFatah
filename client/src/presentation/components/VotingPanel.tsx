"use client";

import { useEffect, useState } from "react";
import { PublicPlayer } from "@/src/domain/types";

export default function VotingPanel({
  players,
  selfId,
  votesCast,
  activeCount,
  resetKey,
  onVote,
}: {
  players: PublicPlayer[];
  selfId: string;
  votesCast: number;
  activeCount: number;
  resetKey: string;
  onVote: (targetId: string) => void;
}) {
  const [pending, setPending] = useState<string | null>(null);

  const hasVoted = pending !== null;

  useEffect(() => {
    setPending(null);
  }, [resetKey]);

  const candidates = players.filter(
    (p) => !p.eliminated && !p.left && p.id !== selfId
  );

  return (
    <div>

      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-3 border-b-2 border-[#17151a] pb-3">

        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.18em] text-[#817a82]">
            Final decision
          </p>

          <p className="font-display text-xl uppercase">
            Who is Fatah?
          </p>
        </div>

        <div className="border-2 border-[#17151a] bg-[#f7c948] px-2.5 py-1 font-display text-[10px] shadow-[2px_2px_0_#17151a]">
          {votesCast}/{activeCount}
        </div>

      </div>

      {hasVoted ? (
        <div className="border-2 border-[#17151a] bg-[#dfe8ff] p-5 text-center shadow-[3px_3px_0_#17151a]">

          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border-2 border-[#17151a] bg-[#5c8dff] font-display text-lg text-white">
            ✓
          </div>

          <p className="font-display text-sm uppercase tracking-[0.1em]">
            Vote locked in
          </p>

          <p className="mt-1 text-xs font-semibold text-[#706a71]">
            Waiting on the rest of the room...
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          {candidates.map((p, index) => {

            const rotations = [
              "rotate-[-1deg]",
              "rotate-[1deg]",
              "rotate-[0deg]",
              "rotate-[2deg]",
            ];

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPending(p.id);
                  onVote(p.id);
                }}
                disabled={pending !== null}
                className={`
                  group
                  ${rotations[index % rotations.length]}
                  relative
                  border-2
                  border-[#17151a]
                  bg-[#fffdf8]
                  p-3
                  text-left
                  shadow-[3px_3px_0_#17151a]
                  transition-all
                  hover:-translate-y-0.5
                  hover:bg-[#f7c948]
                  active:translate-x-[2px]
                  active:translate-y-[2px]
                  active:shadow-[1px_1px_0_#17151a]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `}
              >

                <div className="flex items-center gap-3">

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-[#17151a] bg-[#f4efe4] font-display text-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold">
                      {p.name}
                    </p>

                    <p className="mt-0.5 font-display text-[9px] uppercase tracking-[0.1em] text-[#817a82] group-hover:text-[#17151a]">
                      Vote suspect
                    </p>

                  </div>

                  <span className="ml-auto font-display text-lg opacity-40 transition group-hover:opacity-100">
                    →
                  </span>

                </div>

              </button>
            );
          })}

        </div>
      )}

    </div>
  );
}