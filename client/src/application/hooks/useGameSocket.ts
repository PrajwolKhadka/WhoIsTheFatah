"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../../infrastructure/socket/socketClient";
import { PublicGameState, YourRolePayload } from "../../domain/types";

export function useGameSocket() {
  const [state, setState] = useState<PublicGameState | null>(null);
  const [role, setRole] = useState<YourRolePayload | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const onState = (s: PublicGameState) => setState(s);
    const onRole = (r: YourRolePayload) => setRole(r);

    socket.on("state", onState);
    socket.on("your-role", onRole);

    return () => {
      socket.off("state", onState);
      socket.off("your-role", onRole);
    };
  }, []);

  const startGame = (onError: (msg: string) => void) => {
    getSocket().emit("game:start", {}, (res: { error?: string | null }) => {
      if (res?.error) onError(res.error);
    });
  };

  const restartGame = () => {
    getSocket().emit("game:restart", {}, () => {});
  };

  const submitClue = (word: string, onResult: (error: string | null) => void) => {
    getSocket().emit("clue:submit", { word }, (res: { error?: string | null }) => {
      onResult(res?.error ?? null);
    });
  };

  const submitVote = (targetId: string) => {
    getSocket().emit("vote:submit", { targetId }, () => {});
  };

  return {
    state,
    role,
    setState, // exposed so useRoomSession's rejoin response can seed initial state
    startGame,
    restartGame,
    submitClue,
    submitVote,
  };
}
