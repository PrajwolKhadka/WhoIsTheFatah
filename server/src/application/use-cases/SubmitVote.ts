import { GameEngine } from "../services/GameEngine";

export class SubmitVote {
  constructor(private engine: GameEngine) {}

  execute(code: string, voterId: string, targetId: string): string | null {
    return this.engine.submitVote(code, voterId, targetId);
  }
}
