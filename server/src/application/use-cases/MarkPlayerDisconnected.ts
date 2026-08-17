import { GameEngine } from "../services/GameEngine";

export class MarkPlayerDisconnected {
  constructor(private engine: GameEngine) {}

  execute(code: string, playerId: string): void {
    this.engine.markDisconnected(code, playerId);
  }
}
