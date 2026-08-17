"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameSocket } from "@/src/application/hooks/useGameSocket";
import { useRoomSession } from "@/src/application/hooks/useRoomSession";
import { clearSession } from "@/src/infrastructure/storage/sessionStorage";
import { CLUE_SECONDS, VOTE_SECONDS } from "@/src/domain/constants";
import CaseHeader from "@/src/presentation/components/CaseHeader";
import Timer from "@/src/presentation/components/Timer";
import PlayerRoster from "@/src/presentation/components/PlayerRoster";
import ClueBoard from "@/src/presentation/components/ClueBoard";
import WordCard from "@/src/presentation/components/WordCard";
import VotingPanel from "@/src/presentation/components/VotingPanel";

export default function RoomView({ code }: { code: string }) {
  const router = useRouter();
  const { state, role, setState, startGame, restartGame, submitClue, submitVote } =
    useGameSocket();
  const { selfId, needsJoin, joinError, joinDirect } = useRoomSession(code, setState);

  const [joinName, setJoinName] = useState("");
  const [clueText, setClueText] = useState("");
  const [clueError, setClueError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const lastPhaseRound = useRef<string>("");

  // clear stale clue draft / clue error whenever a new round starts
  useEffect(() => {
    if (!state) return;
    const key = `${state.status}-${state.phase}-${state.round}`;
    if (key !== lastPhaseRound.current) {
      lastPhaseRound.current = key;
      setClueText("");
      setClueError(null);
    }
  }, [state?.status, state?.phase, state?.round]);

  const handleStart = () => {
    setStartError(null);
    startGame((msg) => setStartError(msg));
  };

  const handleSubmitClue = () => {
    const clean = clueText.trim();
    if (!clean) {
      setClueError("Type a word first");
      return;
    }
    submitClue(clean, (error) => {
      if (error) setClueError(error);
      else setClueText("");
    });
  };

  const leaveRoom = () => {
    clearSession();
    router.push("/");
  };

  if (needsJoin) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm case-card p-5 sm:p-6">
          <h1 className="font-display text-lg tracking-[0.15em] uppercase text-lamp mb-1">
            Join room {code}
          </h1>
          <p className="text-paper-dim text-sm mb-4">Enter a name to join this game.</p>
          <input
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            maxLength={20}
            placeholder="Your name"
            className="w-full bg-ink-raised border border-line px-3 py-2.5 text-sm outline-none focus:border-lamp transition-colors mb-3"
          />
          {joinError && <p className="text-alarm text-xs mb-3">{joinError}</p>}
          <button
            onClick={() => joinDirect(joinName)}
            className="w-full bg-lamp text-ink font-display text-sm tracking-[0.15em] uppercase py-3 hover:bg-lamp/90 transition"
          >
            Join room
          </button>
        </div>
      </main>
    );
  }

  if (!state || !selfId) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <p className="text-paper-dim font-display text-sm tracking-widest uppercase">
          Connecting…
        </p>
      </main>
    );
  }

  const self = state.players.find((p) => p.id === selfId);
  const activePlayers = state.players.filter((p) => !p.eliminated);
  const isHost = !!self?.isHost;
  const iAmEliminated = !!self?.eliminated;

  const myClueThisRound = state.clues.find(
    (c) => c.playerId === selfId && c.phase === state.phase && c.round === state.round
  );

  return (
    <main className="flex-1 px-4 py-4 sm:py-6 max-w-6xl w-full mx-auto">
      <CaseHeader
        code={state.code}
        phase={state.phase}
        round={state.round}
        roundsThisPhase={state.roundsThisPhase}
        status={state.status}
      />

      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-6 space-y-4 lg:space-y-0">
        <div className="order-2 lg:order-1 space-y-4">
          <PlayerRoster
            players={state.players}
            selfId={selfId}
            fatahId={state.revealedFatahId}
            submittedIds={
              state.status === "clue"
                ? new Set(
                    state.clues
                      .filter((c) => c.phase === state.phase && c.round === state.round)
                      .map((c) => c.playerId)
                  )
                : undefined
            }
          />
          {state.status !== "lobby" && (
            <button
              onClick={leaveRoom}
              className="w-full text-xs font-display tracking-[0.15em] uppercase text-paper-dim border border-line py-2 hover:border-alarm hover:text-alarm transition"
            >
              Leave room
            </button>
          )}
        </div>

        <div className="order-1 lg:order-2 space-y-4">
          {state.status === "lobby" && (
            <div className="case-card p-5 sm:p-6 text-center">
              <p className="text-paper-dim text-sm mb-4">
                Share code <span className="text-lamp font-display">{state.code}</span> with
                friends. Need at least 3 players to start.
              </p>
              {isHost ? (
                <button
                  onClick={handleStart}
                  disabled={state.players.length < 3}
                  className="bg-lamp text-ink font-display text-sm tracking-[0.15em] uppercase py-3 px-6 hover:bg-lamp/90 transition disabled:opacity-40"
                >
                  Start game ({state.players.length}/3+)
                </button>
              ) : (
                <p className="text-paper-dim text-sm italic">Waiting for host to start…</p>
              )}
              {startError && <p className="text-alarm text-xs mt-3">{startError}</p>}
            </div>
          )}

          {state.status === "clue" && (
            <>
              {iAmEliminated ? (
                <div className="case-card p-5 text-center text-paper-dim text-sm">
                  You&apos;ve been eliminated. Spectating this round.
                </div>
              ) : role ? (
                <WordCard text={role.text} isFatah={role.isFatah} />
              ) : null}

              <Timer
                endsAt={state.timerEnd}
                totalSeconds={CLUE_SECONDS}
                label={`Round ${state.round} — submit a clue`}
              />

              {!iAmEliminated && (
                <div className="case-card p-3 sm:p-4">
                  {myClueThisRound ? (
                    <p className="text-sm text-paper-dim italic">
                      Submitted: <span className="text-paper">{myClueThisRound.word}</span> —
                      waiting on others…
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={clueText}
                        onChange={(e) => setClueText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmitClue()}
                        maxLength={30}
                        placeholder="Type a related word…"
                        autoFocus
                        className="flex-1 bg-ink-raised border border-line px-3 py-2.5 text-sm outline-none focus:border-lamp transition-colors"
                      />
                      <button
                        onClick={handleSubmitClue}
                        className="bg-lamp text-ink font-display text-xs tracking-[0.1em] uppercase px-4 hover:bg-lamp/90 transition"
                      >
                        Send
                      </button>
                    </div>
                  )}
                  {clueError && <p className="text-alarm text-xs mt-2">{clueError}</p>}
                </div>
              )}

              <ClueBoard clues={state.clues} phase={state.phase} />
            </>
          )}

          {state.status === "voting" && (
            <>
              <Timer
                endsAt={state.timerEnd}
                totalSeconds={VOTE_SECONDS}
                label="Voting — who is Fatah?"
              />
              <ClueBoard clues={state.clues} phase={state.phase} />
              {iAmEliminated ? (
                <div className="case-card p-5 text-center text-paper-dim text-sm">
                  You&apos;ve been eliminated. Spectating this vote.
                </div>
              ) : (
                <VotingPanel
                  players={state.players}
                  selfId={selfId}
                  votesCast={state.votesCast}
                  activeCount={activePlayers.length}
                  resetKey={`${state.phase}-${state.status}`}
                  onVote={submitVote}
                />
              )}
            </>
          )}

          {state.status === "reveal" && (
            <div className="case-card p-5 sm:p-6 text-center">
              {state.lastEliminatedId ? (
                <>
                  <p className="font-display text-[11px] tracking-[0.2em] uppercase text-paper-dim mb-2">
                    Eliminated
                  </p>
                  <p className="text-xl font-semibold mb-2">
                    {state.players.find((p) => p.id === state.lastEliminatedId)?.name}
                  </p>
                  <p
                    className={`font-display text-sm tracking-[0.15em] uppercase ${
                      state.lastEliminatedId === state.revealedFatahId
                        ? "text-alarm"
                        : "text-lamp"
                    }`}
                  >
                    {state.lastEliminatedId === state.revealedFatahId
                      ? "That was Fatah!"
                      : "Sojho — not the imposter"}
                  </p>
                </>
              ) : (
                <p className="text-paper-dim text-sm">
                  Vote was tied — nobody was eliminated this round.
                </p>
              )}
              {!state.winner && (
                <p className="text-paper-dim text-xs mt-4">
                  New word incoming — next phase starts shortly…
                </p>
              )}
            </div>
          )}

          {state.status === "ended" && (
            <div className="case-card p-5 sm:p-6 text-center border-2 border-lamp">
              <p className="font-display text-[11px] tracking-[0.2em] uppercase text-paper-dim mb-2">
                Case closed
              </p>
              <p className="text-2xl font-display font-bold uppercase text-lamp mb-3">
                {state.winner === "sojho" ? "Sojho win" : "Fatah wins"}
              </p>
              <p className="text-paper-dim text-sm mb-5">
                Fatah was{" "}
                <span className="text-paper font-semibold">
                  {state.players.find((p) => p.id === state.revealedFatahId)?.name}
                </span>
              </p>
              {isHost ? (
                <button
                  onClick={restartGame}
                  className="bg-lamp text-ink font-display text-sm tracking-[0.15em] uppercase py-3 px-6 hover:bg-lamp/90 transition"
                >
                  Play again
                </button>
              ) : (
                <p className="text-paper-dim text-sm italic">Waiting for host to restart…</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
