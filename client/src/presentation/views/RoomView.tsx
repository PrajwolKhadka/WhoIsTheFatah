"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameSocket } from "@/src/application/hooks/useGameSocket";
import { useRoomSession } from "@/src/application/hooks/useRoomSession";
import { clearSession } from "@/src/infrastructure/storage/sessionStorage";
import { CLUE_SECONDS, VOTE_SECONDS } from "@/src/domain/constants";
import Timer from "@/src/presentation/components/Timer";
import PlayerRoster from "@/src/presentation/components/PlayerRoster";
import ClueBoard from "@/src/presentation/components/ClueBoard";
import WordCard from "@/src/presentation/components/WordCard";
import VotingPanel from "@/src/presentation/components/VotingPanel";

export default function RoomView({ code }: { code: string }) {
  const router = useRouter();

  const {
    state,
    role,
    setState,
    startGame,
    restartGame,
    submitClue,
    submitVote,
  } = useGameSocket();

  const {
    selfId,
    needsJoin,
    joinError,
    joinDirect,
  } = useRoomSession(code, setState);

  const [joinName, setJoinName] = useState("");
  const [clueText, setClueText] = useState("");
  const [clueError, setClueError] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  const lastPhaseRound = useRef<string>("");

  /*
   * Clear stale clue state whenever a new
   * phase or round begins.
   */
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

    startGame((msg) => {
      setStartError(msg);
    });
  };

  const handleSubmitClue = () => {
    const clean = clueText.trim();

    if (!clean) {
      setClueError("Type a word first");
      return;
    }

    submitClue(clean, (error) => {
      if (error) {
        setClueError(error);
      } else {
        setClueText("");
      }
    });
  };

  const leaveRoom = () => {
    clearSession();
    router.push("/");
  };

  /*
   * JOIN SCREEN
   */
  if (needsJoin) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f4efe4] text-[#17151a]">

        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-24 h-48 w-48 rounded-full bg-[#f7c948]/30" />
          <div className="absolute -right-20 top-20 h-56 w-56 rounded-full bg-[#ef6b73]/20" />
          <div className="absolute bottom-[-90px] left-[35%] h-64 w-64 rounded-full bg-[#5c8dff]/15" />

          <div className="absolute left-[9%] top-[28%] rotate-12 text-4xl text-[#ef6b73]">
            ✦
          </div>

          <div className="absolute right-[12%] top-[35%] rotate-12 font-display text-7xl text-[#5c8dff]/30">
            ?
          </div>

          <div className="absolute right-[25%] top-[15%] text-2xl text-[#f7c948]">
            +
          </div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-10">
          <img
            src="/logo.png"
            alt="Sojho or Fatah"
            className="h-24 w-auto object-contain sm:h-28 lg:h-32"
          />

          <div className="hidden border-2 border-[#17151a] bg-white px-4 py-2 font-display text-xs uppercase tracking-[0.12em] shadow-[3px_3px_0_#17151a] sm:block">
            Room {code}
          </div>
        </header>

        <div className="relative z-10 flex min-h-[calc(100vh-120px)] items-center justify-center px-5 pb-12">

          <div className="relative w-full max-w-md">

            <div className="absolute -right-2 -top-2 h-full w-full rotate-2 border-2 border-[#17151a] bg-[#5c8dff]" />

            <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-6 shadow-[7px_7px_0_#17151a] sm:p-8">

              <div className="mb-7 flex items-start justify-between">
                <div>
                  <p className="font-display text-2xl uppercase">
                    Join a game
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#777078]">
                    Enter your name to join the room.
                  </p>
                </div>

                <div className="rotate-3 border-2 border-[#17151a] bg-[#ef6b73] px-2 py-1 font-display text-xs uppercase">
                  PLAYER
                </div>
              </div>

              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-[0.12em]">
                  Your name
                </label>

                <input
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      joinDirect(joinName);
                    }
                  }}
                  maxLength={20}
                  placeholder="Your name"
                  className="w-full border-2 border-[#17151a] bg-[#f4efe4] px-4 py-3.5 text-sm font-semibold outline-none placeholder:text-[#aaa3aa] focus:bg-white focus:ring-4 focus:ring-[#f7c948]/40"
                />
              </div>

              {joinError && (
                <div className="mt-4 border-2 border-[#17151a] bg-[#ef6b73] px-3 py-2.5 text-xs font-bold">
                  {joinError}
                </div>
              )}

              <button
                onClick={() => joinDirect(joinName)}
                className="mt-5 w-full border-2 border-[#17151a] bg-[#f7c948] py-4 font-display text-sm uppercase tracking-[0.14em] shadow-[4px_4px_0_#17151a] transition-all hover:bg-[#ffd65e] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#17151a]"
              >
                Join room →
              </button>

              <div className="mt-6 border-t-2 border-dashed border-[#d8d2c9] pt-4 text-center">
                <p className="text-[11px] font-semibold text-[#817a82]">
                  Room code
                </p>

                <p className="mt-1 font-display text-lg tracking-[0.2em]">
                  {code}
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center">
          <span className="font-display text-[10px] uppercase tracking-[0.25em] text-[#9b949b]">
            Think carefully · Trust nobody
          </span>
        </div>
      </main>
    );
  }

  /*
   * CONNECTING SCREEN
   */
  if (!state || !selfId) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f4efe4] text-[#17151a]">

        <header className="relative z-10 px-6 py-4 sm:px-10">
          <img
            src="/logo.png"
            alt="Sojho or Fatah"
            className="h-24 w-auto object-contain sm:h-28 lg:h-32"
          />
        </header>

        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
          <div className="border-2 border-[#17151a] bg-white px-8 py-5 shadow-[5px_5px_0_#17151a]">
            <p className="font-display text-sm uppercase tracking-[0.18em]">
              Connecting...
            </p>
          </div>
        </div>
      </main>
    );
  }

  const self = state.players.find((p) => p.id === selfId);

  const activePlayers = state.players.filter(
    (p) => !p.eliminated && !p.left
  );

  const isHost = !!self?.isHost;
  const iAmEliminated = !!self?.eliminated;

  const myClueThisRound = state.clues.find(
    (c) =>
      c.playerId === selfId &&
      c.phase === state.phase &&
      c.round === state.round
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4efe4] text-[#17151a]">



      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-24 top-36 h-56 w-56 rounded-full bg-[#f7c948]/25" />

        <div className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-[#ef6b73]/20" />

        <div className="absolute bottom-[-120px] left-[30%] h-80 w-80 rounded-full bg-[#5c8dff]/15" />

        <div className="absolute left-[5%] top-[38%] rotate-12 text-4xl text-[#ef6b73]">
          ✦
        </div>

        <div className="absolute right-[7%] top-[42%] rotate-12 font-display text-7xl text-[#5c8dff]/30">
          ?
        </div>

        <div className="absolute right-[25%] top-[13%] text-2xl text-[#f7c948]">
          +
        </div>

        <div className="absolute bottom-[20%] right-[8%] text-3xl text-[#ef6b73]/50">
          ×
        </div>
      </div>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="relative z-20 flex items-center justify-between px-5 py-3 sm:px-8">

        <img
          src="/logo.png"
          alt="Sojho or Fatah"
          className="h-20 w-auto object-contain sm:h-24 lg:h-28"
        />

        <div className="flex items-center gap-3">

          <div className="hidden border-2 border-[#17151a] bg-white px-4 py-2 shadow-[3px_3px_0_#17151a] sm:block">
            <p className="font-display text-[10px] uppercase tracking-[0.15em] text-[#817a82]">
              Room
            </p>

            <p className="font-display text-lg tracking-[0.18em]">
              {state.code}
            </p>
          </div>

          <div className="border-2 border-[#17151a] bg-[#f7c948] px-4 py-2 shadow-[3px_3px_0_#17151a]">
            <p className="font-display text-[10px] uppercase tracking-[0.12em]">
              Round
            </p>

            <p className="font-display text-lg">
              {state.round}
            </p>
          </div>

        </div>
      </header>



      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-3 sm:px-6">

        {/* Phase strip */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2">

            <div className="border-2 border-[#17151a] bg-white px-4 py-2 shadow-[3px_3px_0_#17151a]">
              <span className="font-display text-xs uppercase tracking-[0.15em]">
                {state.status === "lobby"
                  ? "Lobby"
                  : state.status === "clue"
                    ? "Clue time"
                    : state.status === "voting"
                      ? "Voting"
                      : state.status === "reveal"
                        ? "Reveal"
                        : "Case closed"}
              </span>
            </div>

            {state.status !== "lobby" && (
              <div className="border-2 border-[#17151a] bg-[#ef6b73] px-3 py-2 font-display text-xs uppercase shadow-[3px_3px_0_#17151a]">
                Phase {state.phase}
              </div>
            )}

          </div>

          {state.status !== "lobby" && (
            <button
              onClick={leaveRoom}
              className="border-2 border-[#17151a] bg-white px-4 py-2 font-display text-xs uppercase tracking-[0.12em] shadow-[3px_3px_0_#17151a] transition hover:bg-[#ef6b73] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#17151a]"
            >
              Leave room
            </button>
          )}

        </div>

        {/* Desktop layout */}
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">


          <aside className="space-y-4">

            <div className="relative">

              <div className="absolute -right-1 -top-1 h-full w-full rotate-1 border-2 border-[#17151a] bg-[#5c8dff]" />

              <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[5px_5px_0_#17151a]">

                <div className="mb-4 flex items-center justify-between">
                  <p className="font-display text-xl uppercase">
                    Players
                  </p>

                  <div className="border-2 border-[#17151a] bg-[#f7c948] px-2 py-1 font-display text-xs">
                    {activePlayers.length}
                  </div>
                </div>

                <PlayerRoster
                  players={state.players}
                  selfId={selfId}
                  fatahId={state.revealedFatahId}
                  submittedIds={
                    state.status === "clue"
                      ? new Set(
                          state.clues
                            .filter(
                              (c) =>
                                c.phase === state.phase &&
                                c.round === state.round
                            )
                            .map((c) => c.playerId)
                        )
                      : undefined
                  }
                />

              </div>
            </div>

            {state.status === "lobby" && (
              <div className="border-2 border-[#17151a] bg-white p-4 shadow-[4px_4px_0_#17151a]">

                <p className="mb-2 font-display text-xs uppercase tracking-[0.15em] text-[#817a82]">
                  Room code
                </p>

                <p className="font-display text-3xl tracking-[0.2em]">
                  {state.code}
                </p>

                <p className="mt-2 text-xs font-semibold leading-relaxed text-[#817a82]">
                  Share this code with your friends.
                </p>

              </div>
            )}

            {state.status !== "lobby" && (
              <button
                onClick={leaveRoom}
                className="w-full border-2 border-[#17151a] bg-white py-3 font-display text-xs uppercase tracking-[0.15em] shadow-[3px_3px_0_#17151a] transition hover:bg-[#ef6b73] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#17151a]"
              >
                Leave room
              </button>
            )}

          </aside>


          <section className="space-y-5">



            {state.status === "lobby" && (
              <div className="relative">

                <div className="absolute -right-2 -top-2 h-full w-full rotate-1 border-2 border-[#17151a] bg-[#5c8dff]" />

                <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-6 shadow-[6px_6px_0_#17151a] sm:p-8">

                  <div className="mb-7 flex items-start justify-between">

                    <div>
                      <p className="font-display text-3xl uppercase">
                        Ready?
                      </p>

                      <p className="mt-1 max-w-md text-sm font-semibold leading-relaxed text-[#777078]">
                        Get everyone into the room. Once there are at least
                        three players, the host can start the game.
                      </p>
                    </div>

                    <div className="hidden rotate-3 border-2 border-[#17151a] bg-[#ef6b73] px-3 py-2 font-display text-xs uppercase sm:block">
                      {isHost ? "HOST" : "PLAYER"}
                    </div>

                  </div>

                  <div className="mb-7 grid grid-cols-3 gap-2">

                    <div className="border-2 border-[#17151a] bg-[#f7c948] p-3 text-center">
                      <p className="font-display text-xl">
                        3+
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider">
                        Players
                      </p>
                    </div>

                    <div className="border-2 border-[#17151a] bg-white p-3 text-center">
                      <p className="font-display text-xl">
                        30s
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider">
                        Clue
                      </p>
                    </div>

                    <div className="border-2 border-[#17151a] bg-white p-3 text-center">
                      <p className="font-display text-xl">
                        45s
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider">
                        Vote
                      </p>
                    </div>

                  </div>

                  {isHost ? (
                    <button
                      onClick={handleStart}
                      disabled={state.players.length < 3}
                      className="w-full border-2 border-[#17151a] bg-[#f7c948] py-4 font-display text-sm uppercase tracking-[0.14em] shadow-[4px_4px_0_#17151a] transition hover:bg-[#ffd65e] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#17151a] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Start game ({state.players.length}/3+)
                    </button>
                  ) : (
                    <div className="border-2 border-dashed border-[#bcb5bc] bg-[#f4efe4] py-4 text-center">
                      <p className="font-display text-xs uppercase tracking-[0.15em] text-[#817a82]">
                        Waiting for host to start...
                      </p>
                    </div>
                  )}

                  {startError && (
                    <div className="mt-4 border-2 border-[#17151a] bg-[#ef6b73] px-3 py-2.5 text-xs font-bold">
                      {startError}
                    </div>
                  )}

                </div>
              </div>
            )}


            {state.status === "clue" && (
              <>
                {iAmEliminated ? (
                  <div className="border-2 border-[#17151a] bg-white p-5 text-center shadow-[4px_4px_0_#17151a]">
                    <p className="font-display text-xl uppercase">
                      You&apos;ve been eliminated
                    </p>

                    <p className="mt-2 text-sm text-[#817a82]">
                      You are spectating this round.
                    </p>
                  </div>
                ) : role ? (
                  <div className="relative">
                    <div className="absolute -right-1 -top-1 h-full w-full rotate-1 border-2 border-[#17151a] bg-[#f7c948]" />

                    <div className="relative">
                      <WordCard
                        text={role.text}
                        isFatah={role.isFatah}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="border-2 border-[#17151a] bg-white p-4 shadow-[4px_4px_0_#17151a]">
                  <Timer
                    endsAt={state.timerEnd}
                    totalSeconds={CLUE_SECONDS}
                    label={`Round ${state.round} — submit a clue`}
                  />
                </div>

                {!iAmEliminated && (
                  <div className="border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[4px_4px_0_#17151a]">

                    {myClueThisRound ? (
                      <div className="text-center">

                        <p className="font-display text-xs uppercase tracking-[0.15em] text-[#817a82]">
                          Clue submitted
                        </p>

                        <p className="mt-2 font-display text-2xl">
                          {myClueThisRound.word}
                        </p>

                        <p className="mt-1 text-xs italic text-[#817a82]">
                          Waiting on the other players...
                        </p>

                      </div>
                    ) : (
                      <>
                        <label className="mb-2 block font-display text-xs uppercase tracking-[0.12em]">
                          Your clue
                        </label>

                        <div className="flex gap-2">

                          <input
                            value={clueText}
                            onChange={(e) => setClueText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSubmitClue()
                            }
                            maxLength={30}
                            placeholder="Type a related word..."
                            autoFocus
                            className="min-w-0 flex-1 border-2 border-[#17151a] bg-[#f4efe4] px-3 py-3 text-sm font-semibold outline-none placeholder:text-[#aaa3aa] focus:bg-white focus:ring-4 focus:ring-[#f7c948]/30"
                          />

                          <button
                            onClick={handleSubmitClue}
                            className="border-2 border-[#17151a] bg-[#f7c948] px-5 font-display text-xs uppercase tracking-[0.1em] shadow-[3px_3px_0_#17151a] transition hover:bg-[#ffd65e] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#17151a]"
                          >
                            Send
                          </button>

                        </div>

                        {clueError && (
                          <p className="mt-2 text-xs font-bold text-[#ef6b73]">
                            {clueError}
                          </p>
                        )}
                      </>
                    )}

                  </div>
                )}

                <div className="border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[4px_4px_0_#17151a]">
                  <ClueBoard
                    clues={state.clues}
                    phase={state.phase}
                  />
                </div>
              </>
            )}

            {state.status === "voting" && (
              <>
                <div className="border-2 border-[#17151a] bg-white p-4 shadow-[4px_4px_0_#17151a]">
                  <Timer
                    endsAt={state.timerEnd}
                    totalSeconds={VOTE_SECONDS}
                    label="Voting — who is Fatah?"
                  />
                </div>

                <div className="border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[4px_4px_0_#17151a]">
                  <ClueBoard
                    clues={state.clues}
                    phase={state.phase}
                  />
                </div>

                {iAmEliminated ? (
                  <div className="border-2 border-[#17151a] bg-white p-5 text-center shadow-[4px_4px_0_#17151a]">

                    <p className="font-display text-xl uppercase">
                      You&apos;re out
                    </p>

                    <p className="mt-2 text-sm text-[#817a82]">
                      Spectating this vote.
                    </p>

                  </div>
                ) : (
                  <div className="border-2 border-[#17151a] bg-[#fffdf8] p-4 shadow-[4px_4px_0_#17151a]">

                    <p className="mb-4 font-display text-xl uppercase">
                      Who is Fatah?
                    </p>

                    <VotingPanel
                      players={state.players}
                      selfId={selfId}
                      votesCast={state.votesCast}
                      activeCount={activePlayers.length}
                      resetKey={`${state.phase}-${state.status}`}
                      onVote={submitVote}
                    />

                  </div>
                )}
              </>
            )}


            {state.status === "reveal" && (
              <div className="relative">

                <div className="absolute -right-1 -top-1 h-full w-full rotate-1 border-2 border-[#17151a] bg-[#ef6b73]" />

                <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-6 text-center shadow-[6px_6px_0_#17151a] sm:p-8">

                  {state.lastEliminatedId ? (
                    <>
                      <p className="font-display text-xs uppercase tracking-[0.2em] text-[#817a82]">
                        Eliminated
                      </p>

                      <p className="mt-3 font-display text-3xl uppercase">
                        {
                          state.players.find(
                            (p) => p.id === state.lastEliminatedId
                          )?.name
                        }
                      </p>

                      <div
                        className={`mx-auto mt-4 inline-block border-2 border-[#17151a] px-4 py-2 font-display text-sm uppercase shadow-[3px_3px_0_#17151a] ${
                          state.lastEliminatedId === state.revealedFatahId
                            ? "bg-[#ef6b73]"
                            : "bg-[#f7c948]"
                        }`}
                      >
                        {state.lastEliminatedId === state.revealedFatahId
                          ? "That was Fatah!"
                          : "Sojho — not the imposter"}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-[#817a82]">
                      Vote was tied — nobody was eliminated this round.
                    </p>
                  )}

                  {!state.winner && (
                    <p className="mt-6 text-xs italic text-[#817a82]">
                      New word incoming — next phase starts shortly...
                    </p>
                  )}

                </div>
              </div>
            )}

            {state.status === "ended" && (
              <div className="relative">

                <div className="absolute -right-2 -top-2 h-full w-full rotate-1 border-2 border-[#17151a] bg-[#f7c948]" />

                <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-6 text-center shadow-[7px_7px_0_#17151a] sm:p-8">

                  <div className="mx-auto mb-5 inline-block rotate-[-2deg] border-2 border-[#17151a] bg-[#ef6b73] px-4 py-2 font-display text-xs uppercase shadow-[3px_3px_0_#17151a]">
                    Case closed
                  </div>

                  <p className="font-display text-4xl uppercase">
                    {state.winner === "sojho"
                      ? "Sojho wins!"
                      : "Fatah wins!"}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-[#817a82]">
                    Fatah was
                  </p>

                  <p className="mt-1 font-display text-2xl">
                    {
                      state.players.find(
                        (p) => p.id === state.revealedFatahId
                      )?.name
                    }
                  </p>

                  {isHost ? (
                    <button
                      onClick={restartGame}
                      className="mt-7 border-2 border-[#17151a] bg-[#f7c948] px-8 py-4 font-display text-sm uppercase tracking-[0.15em] shadow-[4px_4px_0_#17151a] transition hover:bg-[#ffd65e] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#17151a]"
                    >
                      Play again →
                    </button>
                  ) : (
                    <p className="mt-6 text-sm italic text-[#817a82]">
                      Waiting for host to restart...
                    </p>
                  )}

                </div>
              </div>
            )}

          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="pointer-events-none relative z-10 pb-4 text-center">
        <span className="font-display text-[10px] uppercase tracking-[0.25em] text-[#9b949b]">
          Think carefully · Trust nobody
        </span>
      </div>

    </main>
  );
}