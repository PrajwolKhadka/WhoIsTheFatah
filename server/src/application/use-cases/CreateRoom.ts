import { nanoid } from "nanoid";
import { Room } from "../../domain/entities/Room";
import { Player } from "../../domain/entities/Player";
import { generateRoomCode } from "../../domain/services/generateRoomCode";
import { RoomRepository } from "../ports/RoomRepository";

export interface CreateRoomResult {
  code: string;
  playerId: string;
}

export class CreateRoom {
  constructor(private rooms: RoomRepository) {}

  execute(hostName: string): CreateRoomResult {
    let code = generateRoomCode();
    while (this.rooms.exists(code)) code = generateRoomCode();

    const playerId = nanoid(10);
    const host: Player = {
      id: playerId,
      name: hostName.slice(0, 20) || "Host",
      socketId: null,
      connected: true,
      isHost: true,
      eliminated: false,
      isFatah: false,
    };

    const room: Room = {
      code,
      hostId: playerId,
      status: "lobby",
      players: [host],
      phase: 0,
      round: 0,
      roundsThisPhase: 0,
      word: "",
      hint: "",
      clues: [],
      votes: [],
      submittedThisRound: new Set(),
      timerEnd: null,
      timerPhaseTag: null,
      winner: null,
      fatahId: null,
      lastEliminatedId: null,
      createdAt: Date.now(),
    };

    this.rooms.save(room);
    return { code, playerId };
  }
}
