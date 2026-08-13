import { Room } from "../../domain/entities/Room";
import { PublicGameState, PublicPlayer } from "./PublicGameState";

export function toPublicGameState(room: Room): PublicGameState {
  const players: PublicPlayer[] = room.players.map((p) => ({
    id: p.id,
    name: p.name,
    connected: p.connected,
    isHost: p.isHost,
    eliminated: p.eliminated,
  }));

  const revealed = room.status === "reveal" || room.status === "ended";

  return {
    code: room.code,
    status: room.status,
    players,
    phase: room.phase,
    round: room.round,
    roundsThisPhase: room.roundsThisPhase,
    clues: room.clues,
    timerEnd: room.timerEnd,
    timerPhaseTag: room.timerPhaseTag,
    winner: room.winner,
    revealedFatahId: revealed ? room.fatahId : null,
    lastEliminatedId: room.lastEliminatedId,
    votesCast: room.votes.length,
    submittedCount: room.submittedThisRound.size,
  };
}
