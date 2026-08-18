"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../../infrastructure/socket/socketClient";
import {
  loadSession,
  saveSession,
} from "../../infrastructure/storage/sessionStorage";
import { PublicGameState } from "../../domain/types";

export function useRoomSession(
  code: string,
  onRejoinState: (s: PublicGameState) => void,
) {
  const [selfId, setSelfId] = useState<string | null>(null);
  const [needsJoin, setNeedsJoin] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const session = loadSession();

    if (!session || session.code !== code) {
      setNeedsJoin(true);
      return;
    }

    setSelfId(session.playerId);

    const attemptRejoin = () => {
      socket.emit(
        "room:rejoin",
        { code, playerId: session.playerId },
        (res: { ok?: boolean; state?: PublicGameState }) => {
          if (res.ok && res.state) {
            onRejoinState(res.state);
          } else {
            setNeedsJoin(true);
          }
        },
      );
    };

    // Run once immediately (covers first page load).
    attemptRejoin();

    // Also re-run on every future reconnect. socket.io reconnects the
    // underlying transport automatically after a drop (backgrounded tab,
    // screen lock, brief network loss), but the server treats that as a
    // brand new anonymous connection — it has no idea which room/player
    // this socket belongs to until we tell it again. Without this, a
    // player can reconnect at the network level yet still get marked as
    // having "left" once the disconnect grace period on the old
    // connection times out.
    socket.on("connect", attemptRejoin);
    return () => {
      socket.off("connect", attemptRejoin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const joinDirect = (name: string) => {
    setJoinError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setJoinError("Enter a name first");
      return;
    }
    getSocket().emit(
      "room:join",
      { code, name: trimmed },
      (res: { code?: string; playerId?: string; error?: string }) => {
        if (res.error || !res.playerId) {
          setJoinError(res.error || "Could not join room");
          return;
        }
        saveSession({ code, playerId: res.playerId, name: trimmed });
        setSelfId(res.playerId);
        setNeedsJoin(false);
      },
    );
  };

  return { selfId, needsJoin, joinError, joinDirect };
}
