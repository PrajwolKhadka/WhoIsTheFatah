import { GameEngine } from "../services/GameEngine";

export class StartGame {
  constructor(private engine: GameEngine) {}

  execute(code: string, requesterId: string): string | null {
    return this.engine.startGame(code, requesterId);
  }
}
