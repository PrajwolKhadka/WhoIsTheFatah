export interface Player {
  id: string; // stable per-connection id (persists across reconnects via token)
  name: string;
  socketId: string | null; // null while disconnected
  connected: boolean;
  isHost: boolean;
  eliminated: boolean;
  isFatah: boolean; // only ever sent to that player's own socket, never broadcast
}