"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../../infrastructure/socket/socketClient";
import { ChatMessage } from "../../domain/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const socket = getSocket();
    const onHistory = (history: ChatMessage[]) => setMessages(history);
    const onMessage = (message: ChatMessage) => setMessages((prev) => [...prev, message]);

    socket.on("chat:history", onHistory);
    socket.on("chat:message", onMessage);

    return () => {
      socket.off("chat:history", onHistory);
      socket.off("chat:message", onMessage);
    };
  }, []);

  const sendMessage = (text: string, onResult?: (error: string | null) => void) => {
    getSocket().emit("chat:send", { text }, (res: { error?: string | null }) => {
      onResult?.(res?.error ?? null);
    });
  };

  return { messages, sendMessage };
}