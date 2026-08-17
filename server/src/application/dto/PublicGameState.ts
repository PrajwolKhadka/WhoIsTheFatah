import { GameStatus, TimerPhaseTag, Winner } from "../../domain/value-objects/GameStatus";
import { Clue } from "../../domain/entities/Clue";

export interface PublicPlayer {
  id: string;
  name: string;
  connected: boolean;
  isHost: boolean;
  eliminated: boolean;
  left: boolean;
}

export interface PublicGameState {
  code: string;
  status: GameStatus;
  players: PublicPlayer[];
  phase: number;
  round: number;
  roundsThisPhase: number;
  clues: Clue[];
  timerEnd: number | null;
  timerPhaseTag: TimerPhaseTag;
  winner: Winner;
  revealedFatahId: string | null; // only populated during 'reveal'/'ended'
  lastEliminatedId: string | null;
  votesCast: number; // count only, not who-voted-for-whom, until reveal
  submittedCount: number; // count only, during clue round
}

export interface YourRolePayload {
  text: string;
  isFatah: boolean;
}
