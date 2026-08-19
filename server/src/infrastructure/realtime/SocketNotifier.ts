import { Server } from "socket.io";
import { RoomRepository } from "../../application/ports/RoomRepository";
import { Notifier } from "../../application/ports/Notifier";
import { toPublicGameState } from "../../application/dto/RoomPresenter";
import { PlayerSocketRegistry } from "./PlayerSocketRegistry";
import { ChatMessage } from "../../domain/entities/ChatMessage";

export class SocketNotifier implements Notifier {
  constructor(
    private io: Server,
    private rooms: RoomRepository,
    private sockets: PlayerSocketRegistry
  ) {}
  broadcastChatMessage(code: string, message: ChatMessage): void {
    this.io.to(code).emit("chat:message",message);
  }

  broadcastState(code: string): void {
    const room = this.rooms.get(code);
    if (!room) return;
    this.io.to(code).emit("state", toPublicGameState(room));
  }

  sendDirect(playerId: string, event: string, payload: unknown): void {
    const socketId = this.sockets.get(playerId);
    if (socketId) this.io.to(socketId).emit(event, payload);
  }
}
