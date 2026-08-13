import { Room } from "../../domain/entities/Room";

export interface RoomRepository {
  save(room: Room): void;
  get(code: string): Room | undefined;
  delete(code: string): void;
  findBySocketId(socketId: string): { code: string; playerId: string } | null;
  exists(code: string): boolean;
}
