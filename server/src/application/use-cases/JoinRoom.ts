import { nanoid } from "nanoid";
import { Player } from "../../domain/entities/Player";
import { MAX_PLAYERS } from "../../domain/constants";
import { RoomRepository } from "../ports/RoomRepository";
import { Notifier } from "../ports/Notifier";

export type JoinRoomResult = { playerId: string } | { error: string };

export class JoinRoom {
  constructor(private rooms: RoomRepository, private notifier: Notifier) {}

  execute(code: string, name: string): JoinRoomResult {
    const room = this.rooms.get(code);
    if (!room) return { error: "Room not found" };
    if (room.status !== "lobby") return { error: "Game already in progress" };
    if (room.players.length >= MAX_PLAYERS) return { error: "Room is full" };

    const playerId = nanoid(10);
    const player: Player = {
      id: playerId,
      name: name.slice(0, 20) || "Player",
      socketId: null,
      connected: true,
      isHost: false,
      eliminated: false,
      left: false,
      isFatah: false,
    };
    room.players.push(player);

    this.rooms.save(room);
    this.notifier.broadcastState(code);
    return { playerId };
  }
}
