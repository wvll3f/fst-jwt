import { IMessage } from "../interfaces/message.interface";
import { MessageRepository } from "../repositories/message.repository";

export class MessageService {

    private readonly messageRepository: MessageRepository;

    constructor() {
        this.messageRepository = new MessageRepository;
    }

    async findChatMessages(senderId: string, receiverId: string) {

        if (!senderId || !receiverId) {
            throw new Error("unidentified sender or receiver")
        }

        if (senderId == receiverId) {
            throw new Error("Impossible to send message to yourself")
        }

        const result = await this.messageRepository.findChatMessages(senderId, receiverId)
        return result;
    }

    async newMenssage(data: IMessage) {

        const requiredFields = ['senderId', 'receiverId'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (!data.image && !data.text) {
            throw new Error(`Cannot send an empty message`);
        }

        const result = this.messageRepository.newMessage(data)
        return result;
    }

}