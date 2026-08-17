import { MIN_PLAYERS, MAX_PLAYERS, REVEAL_SECONDS, VOTE_SECONDS, CLUE_SECONDS, DISCONNECT_GRACE_SECONDS } from "../../domain/constants";
import { activePlayers, Room } from "../../domain/entities/Room";
import { randomRoundsThisPhase } from "../../domain/services/randomRoundsThisPhase";
import { Notifier } from "../ports/Notifier";
import { RoomRepository } from "../ports/RoomRepository";
import { WordRepository } from "../ports/WordRepository";
import { Scheduler } from "../ports/Scheduler";

export class GameEngine {
  constructor(
    private rooms: RoomRepository,
    private words: WordRepository,
    private scheduler: Scheduler,
    private notifier: Notifier,
    private usedWordsByRoom: Map<string, Set<string>> = new Map(),
  ) {}

  startGame(code: string, requesterId: string): string | null {
    const room = this.rooms.get(code);
    if (!room) return "Room Vetena";
    if (requesterId !== room.hostId) return "Host le matra start garna pauxa";
    if (room.players.length < MIN_PLAYERS)
      return `Kamtii ma ${MIN_PLAYERS} chahinxa!`;
    if (room.status !== "lobby") return "Game suru vaisakyo";

    room.players.forEach((p) => (p.eliminated = false));
    this.startPhase(room);
    this.notifier.broadcastState(code);
    return null;
  }

  submitClue(code: string, playerId: string, word: string): string | null {
    const room = this.rooms.get(code);
    if (!room) return " Room Vetena!";
    if (room.status !== "clue") return "Clue lina mandina mah ta!";
    const player = room.players.find((p) => p.id === playerId);
    if (!player || player.eliminated || player.left)
      return "Prabhu hajur active hunu hunna yesma!!!";
    if (room.submittedThisRound.has(playerId)) return "Submit Vaisakyo!";

    const clean = word.trim().slice(0, 30);
    if (!clean) return "Clue khali huna paudaina hajur!";

    room.clues.push({
      playerId,
      playerName: player.name,
      round: room.round,
      phase: room.phase,
      word: clean,
    });
    room.submittedThisRound.add(playerId);
    this.rooms.save(room);
    this.notifier.broadcastState(code);

    if (room.submittedThisRound.size >= activePlayers(room).length) {
      this.forceEndClueRound(code);
    }
    return null;
  }

  submitVote(code: string, voterId: string, targetId: string): string | null {
    const room = this.rooms.get(code);
    if (!room) return " Room Vetena!";
    if (room.status !== "voting") return "Voting garna paxii auney tya!";
    const voter = room.players.find((p) => p.id === voterId);
    const target = room.players.find((p) => p.id === targetId);
    if (!voter || voter.eliminated || voter.left) return "You are not active in this vote";
    if (!target || target.eliminated || target.left) return "Invalid vote target";
    if (voter.id === target.id) return "You cannot vote for yourself";
    if (room.votes.find((v) => v.voterId === voterId)) return "Already voted";

    room.votes.push({ voterId, targetId });
    this.rooms.save(room);
    this.notifier.broadcastState(code);

    if (room.votes.length >= activePlayers(room).length) {
      this.resolveVoting(code);
    }
    return null;
  }
  restartGame(code: string, requesterId: string): string | null {
    const room = this.rooms.get(code);
    if (!room) return "Room not found";
    if (requesterId !== room.hostId) return "Only the host can restart";

    this.scheduler.cancel(code);
    room.status = "lobby";
    room.phase = 0;
    room.round = 0;
    room.roundsThisPhase = 0;
    room.word = "";
    room.hint = "";
    room.clues = [];
    room.votes = [];
    room.submittedThisRound = new Set();
    room.timerEnd = null;
    room.timerPhaseTag = null;
    room.winner = null;
    room.fatahId = null;
    room.lastEliminatedId = null;
    room.players.forEach((p) => {
      p.eliminated = false;
      p.isFatah = false;
    });
    this.usedWordsByRoom.set(code, new Set());

    this.rooms.save(room);
    this.notifier.broadcastState(code);
    return null;
  }
  markDisconnected(code: string, playerId: string): void {
    const room = this.rooms.get(code);
    if (!room) return;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return;

    player.connected = false;
    player.socketId = null;
    this.rooms.save(room);
    this.notifier.broadcastState(code);

    // give them a window to reconnect before they're treated as having left
    this.scheduler.schedule(this.leaveKey(code, playerId), DISCONNECT_GRACE_SECONDS, () =>
      this.handleGraceExpired(code, playerId)
    );
  }

  markReconnected(code: string, playerId: string, socketId: string): boolean {
    const room = this.rooms.get(code);
    if (!room) return false;
    const player = room.players.find((p) => p.id === playerId);
    if (!player) return false;

    player.connected = true;
    player.socketId = socketId;
    this.rooms.save(room);
    this.notifier.broadcastState(code);

    this.scheduler.cancel(this.leaveKey(code, playerId));
    return true;
  }

  private leaveKey(code: string, playerId: string): string {
    return `leave:${code}:${playerId}`;
  }

  private handleGraceExpired(code: string, playerId: string): void {
    this.scheduler.cancel(this.leaveKey(code, playerId));

    const room = this.rooms.get(code);
    if (!room) return;
    const player = room.players.find((p) => p.id === playerId);
    if (!player || player.connected) return; // reconnected in the meantime

    // game hasn't started yet: just remove them, no role/history to preserve
    if (room.status === "lobby") {
      room.players = room.players.filter((p) => p.id !== playerId);
      if (room.players.length === 0) {
        this.scheduler.cancel(code);
        this.rooms.delete(code);
        return;
      }
      if (room.hostId === playerId) {
        room.hostId = room.players[0].id;
        room.players[0].isHost = true;
      }
      this.rooms.save(room);
      this.notifier.broadcastState(code);
      return;
    }

    // game already decided: just reflect that they left, don't touch the outcome
    if (room.status === "ended") {
      player.left = true;
      this.rooms.save(room);
      this.notifier.broadcastState(code);
      return;
    }

    player.left = true;

    // the imposter abandoned the game resulting Sojho win by forfeit
    if (playerId === room.fatahId) {
      room.winner = "sojho";
      room.status = "ended";
      room.timerEnd = null;
      room.timerPhaseTag = null;
      this.scheduler.cancel(code);
      this.rooms.save(room);
      this.notifier.broadcastState(code);
      return;
    }

    const active = activePlayers(room);

    // not enough players left to keep playing resulting Fatah wins by default
    if (active.length < MIN_PLAYERS) {
      room.winner = "fatah";
      room.status = "ended";
      room.timerEnd = null;
      room.timerPhaseTag = null;
      this.scheduler.cancel(code);
      this.rooms.save(room);
      this.notifier.broadcastState(code);
      return;
    }

    this.rooms.save(room);
    this.notifier.broadcastState(code);

    // removing them from the active pool may complete the current round/vote
    if (room.status === "clue" && room.submittedThisRound.size >= active.length) {
      this.forceEndClueRound(code);
    } else if (room.status === "voting" && room.votes.length >= active.length) {
      this.resolveVoting(code);
    }
  }
  private startPhase(room: Room) {
    room.phase += 1;
    room.round = 1;
    room.roundsThisPhase = randomRoundsThisPhase();
    room.clues = [];
    room.votes = [];
    room.submittedThisRound = new Set();
    room.status = "clue";

    const active = activePlayers(room);

    // Fatah is assigned once per game (first phase) and stays Fatah until caught.
    if (room.phase === 1) {
      const fatah = active[Math.floor(Math.random() * active.length)];
      room.players.forEach((p) => (p.isFatah = p.id === fatah.id));
      room.fatahId = fatah.id;
    }

    const used = this.usedWordsByRoom.get(room.code) ?? new Set<string>();
    const pair = this.words.pickWordPair(used);
    used.add(pair.word);
    this.usedWordsByRoom.set(room.code, used);
    room.word = pair.word;
    room.hint = pair.hint;

    this.beginClueRound(room);
  }

  private beginClueRound(room: Room) {
    room.status = "clue";
    room.submittedThisRound = new Set();
    room.timerPhaseTag = "clue";
    room.timerEnd = Date.now() + CLUE_SECONDS * 1000;

    // send each active player their private word/hint for this round
    room.players
      .filter((p) => !p.eliminated)
      .forEach((p) => {
        this.notifier.sendDirect(p.id, "your-role", {
          text: p.isFatah ? room.hint : room.word,
          isFatah: p.isFatah,
        });
      });

    this.rooms.save(room);
    this.notifier.broadcastState(room.code);
    this.scheduler.schedule(room.code, CLUE_SECONDS, () =>
      this.forceEndClueRound(room.code)
    );
  }

  private forceEndClueRound(code: string) {
    const room = this.rooms.get(code);
    if (!room || room.status !== "clue") return;
    this.scheduler.cancel(code);

    const active = activePlayers(room);
    // auto-fill a placeholder clue for anyone who didn't submit in time
    active.forEach((p) => {
      if (!room.submittedThisRound.has(p.id)) {
        room.clues.push({
          playerId: p.id,
          playerName: p.name,
          round: room.round,
          phase: room.phase,
          word: "(no answer)",
        });
        room.submittedThisRound.add(p.id);
      }
    });

    if (room.round >= room.roundsThisPhase) {
      this.beginVoting(room);
    } else {
      room.round += 1;
      this.beginClueRound(room);
    }
  }

  private beginVoting(room: Room) {
    room.status = "voting";
    room.votes = [];
    room.timerPhaseTag = "voting";
    room.timerEnd = Date.now() + VOTE_SECONDS * 1000;
    this.rooms.save(room);
    this.notifier.broadcastState(room.code);
    this.scheduler.schedule(room.code, VOTE_SECONDS, () => this.resolveVoting(room.code));
  }

  private resolveVoting(code: string) {
    const room = this.rooms.get(code);
    if (!room || room.status !== "voting") return;
    this.scheduler.cancel(code);

    const tally = new Map<string, number>();
    room.votes.forEach((v) => tally.set(v.targetId, (tally.get(v.targetId) ?? 0) + 1));

    let eliminatedId: string | null = null;
    let max = -1;
    let tie = false;
    for (const [id, count] of tally) {
      if (count > max) {
        max = count;
        eliminatedId = id;
        tie = false;
      } else if (count === max) {
        tie = true;
      }
    }
    if (tie) eliminatedId = null;

    room.lastEliminatedId = eliminatedId;
    room.status = "reveal";
    room.timerPhaseTag = "reveal";
    room.timerEnd = Date.now() + REVEAL_SECONDS * 1000;

    if (eliminatedId) {
      const player = room.players.find((p) => p.id === eliminatedId);
      if (player) player.eliminated = true;
    }

    const active = activePlayers(room);
    const fatahCaught = eliminatedId === room.fatahId;

    if (fatahCaught) {
      room.winner = "sojho";
    } else if (active.length < MIN_PLAYERS) {
      room.winner = "fatah"; // ran out of players without catching Fatah
    }

    this.rooms.save(room);
    this.notifier.broadcastState(code);

    this.scheduler.schedule(code, REVEAL_SECONDS, () => {
      const r = this.rooms.get(code);
      if (!r) return;
      if (r.winner) {
        r.status = "ended";
        r.timerEnd = null;
        r.timerPhaseTag = null;
      } else {
        this.startPhase(r);
      }
      this.rooms.save(r);
      this.notifier.broadcastState(code);
    });
  }
}
