export type GameStatus = "lobby" | "clue" | "voting" | "reveal" | "ended";

export interface PublicPlayer {
  id: string;
  name: string;
  connected: boolean;
  isHost: boolean;
  eliminated: boolean;
}

export interface Clue {
  playerId: string;
  playerName: string;
  round: number;
  phase: number;
  word: string;
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
  timerPhaseTag: "clue" | "voting" | "reveal" | null;
  winner: "sojho" | "fatah" | null;
  revealedFatahId: string | null;
  lastEliminatedId: string | null;
  votesCast: number;
  submittedCount: number;
}

export interface YourRolePayload {
  text: string;
  isFatah: boolean;
}
