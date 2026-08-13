import { RoomRepository } from "../ports/RoomRepository";
import { Notifier } from "../ports/Notifier";

export class MarkPlayerDisconnected {
  constructor(private rooms: RoomRepository, private notifier: Notifier) {}

  execute(code: string, playerId: string): void {
    const room = this.rooms.get(code);
    if (!room) return;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return;

    player.connected = false;
    player.socketId = null;

    this.rooms.save(room);
    this.notifier.broadcastState(code);
  }
}
