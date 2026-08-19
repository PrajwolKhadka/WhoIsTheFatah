import { nanoid } from "nanoid";
import { CHAT_HISTORY_LIMIT, CHAT_MESSAGE_MAX_LENGTH } from "../../domain/constants";
import { Notifier } from "../ports/Notifier";
import { RoomRepository } from "../ports/RoomRepository";

export class SendChatMessage{
    constructor(private room: RoomRepository, private notifier: Notifier) {}

    execute(code: string, playerId: string, text: string): string | null {
        const room = this.room.get(code);
        if(!room) return "Mero raja room vetenaa!";

        const player = room.players.find(p=> p.id === playerId);
        if(!player) return "Prabhuu hajur yo room ma hoissina!!!";
        if(player.left) return "Room chodesii bolna pahincha ta?";

        const clean = text.trim().slice(0, CHAT_MESSAGE_MAX_LENGTH);
        if(!clean) return "Khali message kaslai pathako??";

        const message = {
            id : nanoid(10),
            playerId,
            playerName: player.name,
            text : clean,
            sentAt : Date.now()
        }

        room.chatMessages.push(message);
        if(room.chatMessages.length > CHAT_HISTORY_LIMIT){
            room.chatMessages = room.chatMessages.slice(-CHAT_HISTORY_LIMIT);
        }
        this.room.save(room);
        this.notifier.broadcastChatMessage(code, message);
        return null;
    }
}