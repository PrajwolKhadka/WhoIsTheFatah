import { GameEngine } from "../services/GameEngine";

export class SubmitClue {
  constructor(private engine: GameEngine) {}

  execute(code: string, playerId: string, word: string): string | null {
    return this.engine.submitClue(code, playerId, word);
  }
}
