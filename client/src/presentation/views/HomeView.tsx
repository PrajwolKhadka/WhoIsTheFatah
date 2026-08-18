"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoomEntry } from "@/src/application/hooks/useRoomEntry";

type Mode = "create" | "join";

export default function HomeView() {
  const router = useRouter();
  const { loading, error, setError, createRoom, joinRoom } = useRoomEntry();

  const [mode, setMode] = useState<Mode>("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const submit = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Enter a name first");
      return;
    }

    if (mode === "create") {
      createRoom(trimmedName, (roomCode) => {
        router.push(`/room/${roomCode}`);
      });
    } else {
      const upper = code.trim().toUpperCase();

      if (upper.length < 4) {
        setError("Enter a valid room code");
        return;
      }

      joinRoom(upper, trimmedName, (roomCode) => {
        router.push(`/room/${roomCode}`);
      });
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4efe4] text-[#17151a]">
      {/* Background doodles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-32 h-40 w-40 rounded-full bg-[#f7c948] opacity-30" />

        <div className="absolute right-[-50px] top-20 h-52 w-52 rounded-full bg-[#ef6b73] opacity-20" />

        <div className="absolute bottom-[-80px] left-[30%] h-64 w-64 rounded-full bg-[#5c8dff] opacity-15" />

        {/* Star */}
        <div className="absolute left-[8%] top-[22%] rotate-12 text-4xl text-[#ef6b73]">
          ✦
        </div>

        {/* Question mark */}
        <div className="absolute right-[10%] top-[30%] rotate-12 font-display text-7xl text-[#5c8dff] opacity-40">
          ?
        </div>

        {/* Scribble */}
        <div className="absolute bottom-[18%] left-[8%] h-12 w-24 rotate-[-8deg] border-b-4 border-[#17151a] opacity-20" />

        {/* Small stars */}
        <div className="absolute right-[25%] top-[15%] text-2xl text-[#f7c948]">
          +
        </div>

        <div className="absolute bottom-[25%] right-[8%] text-3xl text-[#ef6b73]">
          ×
        </div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Sojho or Fatah"
            className="h-24 w-auto object-contain sm:h-28 lg:h-32"
          />
        </div>
        <button
          type="button"
          className="hidden border-2 border-[#17151a] bg-white px-4 py-2 font-display text-xs uppercase tracking-[0.12em] shadow-[3px_3px_0_#17151a] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_#17151a] sm:block"
        >
          How to play
        </button>
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center px-5 pb-14 pt-6">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_420px] lg:gap-20">
          {/* LEFT SIDE */}
          <section className="text-center lg:text-left">
            {/* Little label */}
            <div className="mb-5 inline-flex -rotate-2 items-center border-2 border-[#17151a] bg-[#f7c948] px-3 py-1.5 shadow-[3px_3px_0_#17151a]">
              <span className="font-display text-xs uppercase tracking-[0.12em]">
                झुटो नबोल्नु ल!
              </span>
            </div>

            {/* Main title */}
            <h1 className="font-display text-[clamp(4rem,10vw,8rem)] uppercase leading-[0.78] tracking-[-0.04em]">
              <span className="relative inline-block">
                SOJHO
                <span className="absolute -bottom-2 left-1/2 h-2 w-[85%] -translate-x-1/2 rotate-[-2deg] bg-[#ef6b73]" />
              </span>

              <span className="mx-3 inline-block text-[0.42em] align-middle text-[#5c8dff]">
                कि
              </span>

              <span className="inline-block text-[#17151a]">FATAH?</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-8 max-w-xl text-lg font-semibold leading-relaxed text-[#4d4850] lg:mx-0 lg:text-xl">
              Everyone gets the same thing.
              <br />
              <span className="font-bold text-[#17151a]">
                Except one player gets a little extra information.
              </span>
            </p>

            <p className="mt-3 font-display text-sm uppercase tracking-[0.12em] text-[#7a737d]">
              जोशमा बेहोस नहुनु है!
            </p>

            {/* Game facts */}
            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <div className="flex items-center gap-2 border-2 border-[#17151a] bg-white px-4 py-2 shadow-[3px_3px_0_#17151a]">
                <span className="font-display text-lg">3–12</span>
                <span className="text-xs font-bold uppercase tracking-wide text-[#6b646d]">
                  Players
                </span>
              </div>

              <div className="flex items-center gap-2 border-2 border-[#17151a] bg-white px-4 py-2 shadow-[3px_3px_0_#17151a]">
                <span className="font-display text-lg">30s</span>
                <span className="text-xs font-bold uppercase tracking-wide text-[#6b646d]">
                  Clue
                </span>
              </div>

              <div className="flex items-center gap-2 border-2 border-[#17151a] bg-white px-4 py-2 shadow-[3px_3px_0_#17151a]">
                <span className="font-display text-lg">45s</span>
                <span className="text-xs font-bold uppercase tracking-wide text-[#6b646d]">
                  Vote
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="relative">
            {/* Offset decorative block */}
            <div className="absolute -right-2 -top-2 h-full w-full rotate-2 bg-[#5c8dff] border-2 border-[#17151a]" />

            <div className="relative border-2 border-[#17151a] bg-[#fffdf8] p-5 shadow-[7px_7px_0_#17151a] sm:p-7">
              {/* Card heading */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="font-display text-2xl uppercase tracking-wide">
                    {mode === "create" ? "Start a game" : "Join a game"}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#777078]">
                    {mode === "create"
                      ? "Make a room and bring your friends."
                      : "Enter the secret room code."}
                  </p>
                </div>

                <div className="rotate-3 border-2 border-[#17151a] bg-[#ef6b73] px-2 py-1 font-display text-xs uppercase">
                  {mode === "create" ? "HOST" : "PLAYER"}
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-7 grid grid-cols-2 border-2 border-[#17151a]">
                <button
                  type="button"
                  onClick={() => {
                    setMode("create");
                    setError("");
                  }}
                  className={`border-r-2 border-[#17151a] py-3 font-display text-xs uppercase tracking-[0.12em] transition ${
                    mode === "create"
                      ? "bg-[#f7c948] text-[#17151a]"
                      : "bg-transparent text-[#777078] hover:bg-[#f4efe4]"
                  }`}
                >
                  New room
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("join");
                    setError("");
                  }}
                  className={`py-3 font-display text-xs uppercase tracking-[0.12em] transition ${
                    mode === "join"
                      ? "bg-[#5c8dff] text-white"
                      : "bg-transparent text-[#777078] hover:bg-[#f4efe4]"
                  }`}
                >
                  Join room
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="mb-2 block font-display text-xs uppercase tracking-[0.12em]">
                    Your name
                  </label>

                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submit();
                    }}
                    maxLength={20}
                    placeholder="e.g. Fatah_Kta_Moh123"
                    className="w-full border-2 border-[#17151a] bg-[#f4efe4] px-4 py-3.5 text-sm font-semibold outline-none placeholder:text-[#aaa3aa] focus:bg-white focus:ring-4 focus:ring-[#f7c948]/40"
                  />
                </div>

                {/* Room code */}
                {mode === "join" && (
                  <div>
                    <label className="mb-2 block font-display text-xs uppercase tracking-[0.12em]">
                      Room code
                    </label>

                    <input
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase());
                        if (error) setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submit();
                      }}
                      maxLength={6}
                      placeholder="ABCDE"
                      className="w-full border-2 border-[#17151a] bg-[#f4efe4] px-4 py-3.5 text-center font-display text-xl tracking-[0.25em] outline-none placeholder:text-[#aaa3aa] focus:bg-white focus:ring-4 focus:ring-[#5c8dff]/30"
                    />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="border-2 border-[#17151a] bg-[#ef6b73] px-3 py-2.5 text-xs font-bold">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className={`group relative w-full border-2 border-[#17151a] py-4 font-display text-sm uppercase tracking-[0.14em] shadow-[4px_4px_0_#17151a] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#17151a] disabled:cursor-not-allowed disabled:opacity-50 ${
                    mode === "create"
                      ? "bg-[#f7c948] hover:bg-[#ffd65e]"
                      : "bg-[#5c8dff] text-white hover:bg-[#709bff]"
                  }`}
                >
                  {loading
                    ? "Please wait..."
                    : mode === "create"
                      ? "Create room →"
                      : "Join room →"}
                </button>
              </div>

              {/* Card bottom */}
              <div className="mt-6 border-t-2 border-dashed border-[#d8d2c9] pt-4 text-center">
                <p className="text-[11px] font-semibold text-[#817a82]">
                  {mode === "create"
                    ? "Share your room code once everyone is ready."
                    : "Ask the host for the room code."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
