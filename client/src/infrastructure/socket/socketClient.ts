"use client";

import { io, Socket } from "socket.io-client";
import { getSocketUrl } from "../config/env";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}
