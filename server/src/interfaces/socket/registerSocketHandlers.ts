import { Server, Socket } from "socket.io";
import { RoomRepository } from "../../application/ports/RoomRepository";
import { CreateRoom } from "../../application/use-cases/CreateRoom";
import { JoinRoom } from "../../application/use-cases/JoinRoom";
import { RejoinRoom } from "../../application/use-cases/RejoinRoom";
import { MarkPlayerDisconnected } from "../../application/use-cases/MarkPlayerDisconnected";
import { StartGame } from "../../application/use-cases/StartGame";
import { SubmitClue } from "../../application/use-cases/SubmitClue";
import { SubmitVote } from "../../application/use-cases/SubmitVote";
import { RestartGame } from "../../application/use-cases/RestartGame";
import { toPublicGameState } from "../../application/dto/RoomPresenter";
import { PlayerSocketRegistry } from "../../infrastructure/realtime/PlayerSocketRegistry";
import { SocketSession } from "./socketSession";

export interface SocketUseCases {
  createRoom: CreateRoom;
  joinRoom: JoinRoom;
  rejoinRoom: RejoinRoom;
  markPlayerDisconnected: MarkPlayerDisconnected;
  startGame: StartGame;
  submitClue: SubmitClue;
  submitVote: SubmitVote;
  restartGame: RestartGame;
}

export function registerSocketHandlers(
  io: Server,
  rooms: RoomRepository,
  sockets: PlayerSocketRegistry,
  useCases: SocketUseCases,
) {
  io.on("connection", (socket: Socket) => {
    const data = socket.data as SocketSession;

    socket.on("room:create", ({ name }: { name: string }, cb) => {
      const { code, playerId } = useCases.createRoom.execute(name || "Host");
      sockets.set(playerId, socket.id);
      useCases.rejoinRoom.execute(code, playerId, socket.id);
      socket.join(code);
      data.code = code;
      data.playerId = playerId;
      cb?.({ code, playerId });
    });

    socket.on(
      "room:join",
      ({ code, name }: { code: string; name: string }, cb) => {
        const upper = (code || "").toUpperCase().trim();
        const result = useCases.joinRoom.execute(upper, name || "Player");
        if ("error" in result) {
          cb?.({ error: result.error });
          return;
        }
        sockets.set(result.playerId, socket.id);
        useCases.rejoinRoom.execute(upper, result.playerId, socket.id);
        socket.join(upper);
        data.code = upper;
        data.playerId = result.playerId;
        cb?.({ code: upper, playerId: result.playerId });
      },
    );

    socket.on(
      "room:rejoin",
      ({ code, playerId }: { code: string; playerId: string }, cb) => {
        const upper = (code || "").toUpperCase().trim();
        const ok = useCases.rejoinRoom.execute(upper, playerId, socket.id);
        if (!ok) {
          cb?.({ error: "Could not rejoin room" });
          return;
        }
        sockets.set(playerId, socket.id);
        socket.join(upper);
        data.code = upper;
        data.playerId = playerId;
        const room = rooms.get(upper);
        cb?.({ ok: true, state: room ? toPublicGameState(room) : null });
      },
    );

    socket.on("game:start", (_payload, cb) => {
      if (!data.code || !data.playerId) return;
      const error = useCases.startGame.execute(data.code, data.playerId);
      cb?.({ error });
    });

    socket.on("game:restart", (_payload, cb) => {
      if (!data.code || !data.playerId) return;
      const error = useCases.restartGame.execute(data.code, data.playerId);
      cb?.({ error });
    });

    socket.on("clue:submit", ({ word }: { word: string }, cb) => {
      if (!data.code || !data.playerId) return;
      const error = useCases.submitClue.execute(data.code, data.playerId, word);
      cb?.({ error });
    });

    socket.on("vote:submit", ({ targetId }: { targetId: string }, cb) => {
      if (!data.code || !data.playerId) return;
      const error = useCases.submitVote.execute(
        data.code,
        data.playerId,
        targetId,
      );
      cb?.({ error });
    });

    socket.on("disconnect", () => {
      if (!data.code || !data.playerId) return;
      setTimeout(() => {
        // Only mark offline if this socket is still the one registered
        // (i.e. they didn't already rejoin with a new socket)
        const currentSocketId = sockets.get(data.playerId!);
        if (currentSocketId === socket.id) {
          useCases.markPlayerDisconnected.execute(data.code!, data.playerId!);
        }
      }, 1500);
      // if (data.code && data.playerId) {
      //   useCases.markPlayerDisconnected.execute(data.code, data.playerId);
      // }
    });
  });
}
