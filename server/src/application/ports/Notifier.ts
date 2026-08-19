import { ChatMessage } from "../../domain/entities/ChatMessage";

export interface Notifier {
  broadcastState(code: string): void; // engine signals "state changed" -> caller re-serializes + emits
  sendDirect(playerId: string, event: string, payload: unknown): void;
  broadcastChatMessage(code: string, message: ChatMessage): void;
}
