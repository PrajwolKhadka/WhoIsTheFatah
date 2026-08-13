import { GameEngine } from "../services/GameEngine";

export class RestartGame {
  constructor(private engine: GameEngine) {}

  execute(code: string, requesterId: string): string | null {
    return this.engine.restartGame(code, requesterId);
  }
}
