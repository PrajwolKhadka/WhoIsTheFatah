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
      createRoom(trimmedName, (roomCode) => router.push(`/room/${roomCode}`));
    } else {
      const upper = code.trim().toUpperCase();
      if (upper.length < 4) {
        setError("Enter a valid room code");
        return;
      }
      joinRoom(upper, trimmedName, (roomCode) => router.push(`/room/${roomCode}`));
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl sm:text-3xl tracking-[0.15em] uppercase text-lamp">
            Sojho or Fatah
          </h1>
          <p className="text-paper-dim text-sm mt-2">
            One player only has a hint. Find them before the round runs out.
          </p>
        </div>

        <div className="case-card p-5 sm:p-6">
          <div className="flex border border-line mb-5">
            <button
              onClick={() => setMode("create")}
              className={`flex-1 py-2 text-xs font-display tracking-[0.15em] uppercase transition-colors ${
                mode === "create" ? "bg-lamp text-ink" : "text-paper-dim"
              }`}
            >
              New room
            </button>
            <button
              onClick={() => setMode("join")}
              className={`flex-1 py-2 text-xs font-display tracking-[0.15em] uppercase transition-colors ${
                mode === "join" ? "bg-lamp text-ink" : "text-paper-dim"
              }`}
            >
              Join room
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-display tracking-[0.15em] uppercase text-paper-dim mb-1.5">
                Your name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                placeholder="e.g. Prajwol"
                className="w-full bg-ink-raised border border-line px-3 py-2.5 text-sm outline-none focus:border-lamp transition-colors"
              />
            </div>

            {mode === "join" && (
              <div>
                <label className="block text-[11px] font-display tracking-[0.15em] uppercase text-paper-dim mb-1.5">
                  Room code
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="ABCDE"
                  className="w-full bg-ink-raised border border-line px-3 py-2.5 text-sm outline-none focus:border-lamp transition-colors font-display tracking-[0.2em]"
                />
              </div>
            )}

            {error && <p className="text-alarm text-xs">{error}</p>}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-lamp text-ink font-display text-sm tracking-[0.15em] uppercase py-3 mt-2 hover:bg-lamp/90 active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "create" ? "Create room" : "Join room"}
            </button>
          </div>
        </div>

        <p className="text-center text-paper-dim text-xs mt-6">
          3–12 players · 15s to clue, 45s to vote
        </p>
      </div>
    </main>
  );
}
