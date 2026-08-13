import { Room } from "../../domain/entities/Room";
import { RoomRepository } from "../../application/ports/RoomRepository";

export class InMemoryRoomRepository implements RoomRepository {
  private rooms = new Map<string, Room>();

  save(room: Room): void {
    this.rooms.set(room.code, room);
  }

  get(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  delete(code: string): void {
    this.rooms.delete(code);
  }

  exists(code: string): boolean {
    return this.rooms.has(code);
  }

  findBySocketId(socketId: string): { code: string; playerId: string } | null {
    for (const room of this.rooms.values()) {
      const player = room.players.find((p) => p.socketId === socketId);
      if (player) return { code: room.code, playerId: player.id };
    }
    return null;
  }
}
