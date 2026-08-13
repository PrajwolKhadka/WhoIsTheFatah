import { RoomRepository } from "../ports/RoomRepository";
import { Notifier } from "../ports/Notifier";

export class RejoinRoom {
  constructor(private rooms: RoomRepository, private notifier: Notifier) {}

  execute(code: string, playerId: string, socketId: string): boolean {
    const room = this.rooms.get(code);
    if (!room) return false;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return false;

    player.connected = true;
    player.socketId = socketId;

    this.rooms.save(room);
    this.notifier.broadcastState(code);
    return true;
  }
}
