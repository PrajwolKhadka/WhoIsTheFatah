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
  const activePlayers = players.filter(
    (p) => !p.eliminated && !p.left
  ).length;

  return (
    <div className="border-2 border-[#17151a] bg-[#fffdf8] p-3 sm:p-4">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">

        <div>
          <div className="font-display text-[11px] uppercase tracking-[0.18em] text-[#817a82]">
            Suspects
          </div>

          <div className="mt-1 font-display text-lg uppercase">
            Who&apos;s here?
          </div>
        </div>

        <div className="border-2 border-[#17151a] bg-[#f7c948] px-2.5 py-1 font-display text-xs shadow-[2px_2px_0_#17151a]">
          {activePlayers} active
        </div>

      </div>

      {/* Players */}
      <ul className="space-y-2">

        {players.map((p, i) => {
          const isFatahRevealed = fatahId === p.id;
          const submitted = submittedIds?.has(p.id);
          const isOut = p.eliminated || p.left;
          const isSelf = p.id === selfId;

          return (
            <li
              key={p.id}
              className={`
                relative flex items-center justify-between gap-2
                border-2 px-2.5 py-2.5
                transition
                ${
                  isOut
                    ? "border-[#bdb7bd] bg-[#ece8df] opacity-50"
                    : isFatahRevealed
                      ? "border-[#17151a] bg-[#ef6b73]"
                      : isSelf
                        ? "border-[#17151a] bg-[#fff2b8]"
                        : "border-[#17151a] bg-white"
                }
              `}
            >

              {/* Player information */}
              <div className="flex min-w-0 items-center gap-2.5">

                {/* Number */}
                <span
                  className={`
                    flex h-7 w-7 shrink-0 items-center justify-center
                    border border-[#17151a]
                    font-display text-[10px]
                    ${
                      isOut
                        ? "bg-[#d9d4d0]"
                        : isFatahRevealed
                          ? "bg-[#fffdf8]"
                          : "bg-[#f4efe4]"
                    }
                  `}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Name */}
                <div className="min-w-0">

                  <div
                    className={`
                      truncate text-sm
                      ${
                        isOut
                          ? "line-through text-[#817a82]"
                          : isSelf
                            ? "font-bold text-[#17151a]"
                            : "font-semibold text-[#17151a]"
                      }
                    `}
                  >
                    {p.name}
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">

                    {isSelf && (
                      <span className="font-display text-[9px] uppercase tracking-[0.1em] text-[#5c8dff]">
                        You
                      </span>
                    )}

                    {p.isHost && (
                      <span className="font-display text-[9px] uppercase tracking-[0.1em] text-[#817a82]">
                        Host
                      </span>
                    )}

                  </div>

                </div>
              </div>

              {/* Right side */}
              <div className="flex shrink-0 items-center gap-2">

                {/* Connection status */}
                {p.left ? (
                  <span className="border border-[#17151a] bg-[#d9d4d0] px-1.5 py-0.5 font-display text-[9px] uppercase tracking-wide">
                    Left
                  </span>
                ) : !p.connected ? (
                  <span className="border border-[#17151a] bg-white px-1.5 py-0.5 font-display text-[9px] uppercase tracking-wide">
                    Offline
                  </span>
                ) : null}

                {/* Fatah reveal */}
                {isFatahRevealed && (
                  <span className="rotate-2 border-2 border-[#17151a] bg-[#ef6b73] px-2 py-1 font-display text-[9px] uppercase tracking-[0.08em] shadow-[2px_2px_0_#17151a]">
                    Fatah
                  </span>
                )}

                {/* Submitted indicator */}
                {!compact && submittedIds && !isOut && (
                  <span
                    title={submitted ? "Submitted" : "Waiting"}
                    className={`
                      flex h-5 w-5 items-center justify-center
                      border-2 border-[#17151a]
                      ${
                        submitted
                          ? "bg-[#5c8dff]"
                          : "bg-[#f4efe4]"
                      }
                    `}
                  >
                    {submitted ? (
                      <span className="text-[10px] font-bold text-white">
                        ✓
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#817a82]">
                        ·
                      </span>
                    )}
                  </span>
                )}

              </div>
            </li>
          );
        })}

      </ul>

      {/* Empty state */}
      {players.length === 0 && (
        <div className="border-2 border-dashed border-[#bdb7bd] bg-[#f4efe4] px-3 py-5 text-center">
          <p className="font-display text-xs uppercase tracking-[0.12em] text-[#817a82]">
            Nobody here yet
          </p>
        </div>
      )}

    </div>
  );
}