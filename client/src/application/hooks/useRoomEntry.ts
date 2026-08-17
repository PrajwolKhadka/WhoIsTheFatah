"use client";

import { useState } from "react";
import { getSocket } from "../../infrastructure/socket/socketClient";
import { saveSession } from "../../infrastructure/storage/sessionStorage";

export function useRoomEntry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = (name: string, onDone: (code: string) => void) => {
    setError(null);
    setLoading(true);
    getSocket().emit(
      "room:create",
      { name },
      (res: { code: string; playerId: string }) => {
        setLoading(false);
        saveSession({ code: res.code, playerId: res.playerId, name });
        onDone(res.code);
      }
    );
  };

  const joinRoom = (code: string, name: string, onDone: (code: string) => void) => {
    setError(null);
    setLoading(true);
    getSocket().emit(
      "room:join",
      { code, name },
      (res: { code?: string; playerId?: string; error?: string }) => {
        setLoading(false);
        if (res.error || !res.code || !res.playerId) {
          setError(res.error || "Could not join room");
          return;
        }
        saveSession({ code: res.code, playerId: res.playerId, name });
        onDone(res.code);
      }
    );
  };

  return { loading, error, setError, createRoom, joinRoom };
}
