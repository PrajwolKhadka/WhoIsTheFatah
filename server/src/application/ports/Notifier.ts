export interface Notifier {
  broadcastState(code: string): void; // engine signals "state changed" -> caller re-serializes + emits
  sendDirect(playerId: string, event: string, payload: unknown): void;
}
