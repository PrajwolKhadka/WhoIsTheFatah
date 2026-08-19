import { nanoid } from "nanoid";
import { CHAT_MESSAGE_MAX_LENGTH } from "../../domain/constants";
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

        room.chatMessage.push(message);
        if(room.chatMessage.length > CHAT_MESSAGE_MAX_LENGTH){
            room.chatMessage = room.chatMessage.slice(-CHAT_MESSAGE_MAX_LENGTH);
        }
        this.room.save(room);
        this.notifier.broadcastChatMessage(code, message);
        return null;
    }
}