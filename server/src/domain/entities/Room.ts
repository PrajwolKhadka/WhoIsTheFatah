import { GameStatus, TimerPhaseTag, Winner } from "../value-objects/GameStatus";
import { Clue } from "./Clue";
import { Player } from "./Player";
import { Vote } from "./Vote";
import { ChatMessage } from "./ChatMessage";
export interface Room {
    code: string;
    hostId: string;
    status: GameStatus;
    players: Player[];
    phase: number;
    round: number;
    roundsThisPhase: number;
    word: string;
    hint: string;
    clues: Clue[];
    votes: Vote[];
    submittedThisRound: Set<string>;
    timerEnd: number | null;
    timerPhaseTag: TimerPhaseTag;
    winner: Winner;
    fatahId: string | null;
    chatMessages: ChatMessage[];
    lastEliminatedId: string | null;
    createdAt: number;
}

export function activePlayers(room: Room): Player[]{
    return room.players.filter((p)=> !p.eliminated);
}