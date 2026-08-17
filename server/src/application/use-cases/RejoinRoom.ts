import { GameEngine } from "../services/GameEngine";

export class RejoinRoom {
  constructor(private engine: GameEngine) {}

  execute(code: string, playerId: string, socketId: string): boolean {
    return this.engine.markReconnected(code, playerId, socketId);
  }
}
