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

  const candidates = players.filter((p) => !p.eliminated && p.id !== selfId);

  return (
    <div className="case-card p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-[11px] tracking-[0.2em] uppercase text-paper-dim">
          Cast your vote
        </span>
        <span className="font-display text-[11px] text-paper-dim">
          {votesCast}/{activeCount} voted
        </span>
      </div>

      {hasVoted ? (
        <p className="text-sm text-paper-dim italic py-2">
          Vote locked in. Waiting on the rest of the room…
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {candidates.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPending(p.id);
                onVote(p.id);
              }}
              disabled={pending !== null}
              className="text-left px-3 py-2.5 border border-line bg-ink-raised hover:border-alarm hover:bg-alarm-dim/20 active:scale-[0.98] transition-colors disabled:opacity-50 text-sm"
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
