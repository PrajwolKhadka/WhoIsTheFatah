import http from "http";
import { Server } from "socket.io";
import { createExpressApp } from "./infrastructure/http/createExpressApp";
import { InMemoryRoomRepository } from "./infrastructure/repositories/InMemoryRoomRepository";
import { StaticWordRepository } from "./infrastructure/words/StaticWordRepository";
import { TimeoutScheduler } from "./infrastructure/scheduler/TimeoutScheduler";
import { PlayerSocketRegistry } from "./infrastructure/realtime/PlayerSocketRegistry";
import { SocketNotifier } from "./infrastructure/realtime/SocketNotifier";
import { GameEngine } from "./application/services/GameEngine";
import { CreateRoom } from "./application/use-cases/CreateRoom";
import { JoinRoom } from "./application/use-cases/JoinRoom";
import { RejoinRoom } from "./application/use-cases/RejoinRoom";
import { MarkPlayerDisconnected } from "./application/use-cases/MarkPlayerDisconnected";
import { StartGame } from "./application/use-cases/StartGame";
import { SubmitClue } from "./application/use-cases/SubmitClue";
import { SubmitVote } from "./application/use-cases/SubmitVote";
import { RestartGame } from "./application/use-cases/RestartGame";
import { registerSocketHandlers } from "./interfaces/socket/registerSocketHandlers";

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const app = createExpressApp(CLIENT_URL);
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_URL, methods: ["GET", "POST"] } });

const rooms = new InMemoryRoomRepository();
const words = new StaticWordRepository();
const scheduler = new TimeoutScheduler();
const sockets = new PlayerSocketRegistry();
const notifier = new SocketNotifier(io, rooms, sockets);

const engine = new GameEngine(rooms, words, scheduler, notifier);

const useCases = {
  createRoom: new CreateRoom(rooms),
  joinRoom: new JoinRoom(rooms, notifier),
  rejoinRoom: new RejoinRoom(rooms, notifier),
  markPlayerDisconnected: new MarkPlayerDisconnected(rooms, notifier),
  startGame: new StartGame(engine),
  submitClue: new SubmitClue(engine),
  submitVote: new SubmitVote(engine),
  restartGame: new RestartGame(engine),
};

registerSocketHandlers(io, rooms, sockets, useCases);

server.listen(PORT, () => {
  console.log(`Imposter game server listening on :${PORT}`);
});
