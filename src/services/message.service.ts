import { IMessageRequest } from "../interfaces/message.interface";
import { MessageRepository } from "../repositories/message.repository";
import { UserService } from "./user.service";
import { server as app } from "../server";

export class MessageService {

    private messageRepository: MessageRepository;
    private userService: UserService;

    constructor() {
        this.messageRepository = new MessageRepository;
        this.userService = new UserService;
    }

    async findChatMessages(senderId: string, receiverId: string) {

        if (!senderId || !receiverId) {
            throw new Error("unidentified sender or receiver")
        }

        if (senderId == receiverId) {
            throw new Error("Impossible to send message to yourself")
        }

        const sender = await this.userService.findbyId(senderId)
        const receiver = await this.userService.findbyId(receiverId)

        if (!sender || !receiver) {
            throw new Error("unidentified sender or receiver")
        }

        const result = await this.messageRepository.findChatMessages(senderId, receiverId)
        return result;
    }

    async newMenssage(data: IMessageRequest) {

        const requiredFields = ['senderId', 'receiverId'];
        const missingFields = requiredFields.filter((field) => {
            !data[field]
        });

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (!data.image && !data.text) {
            throw new Error(`Cannot send an empty message`);
        }

        const newMessage = this.messageRepository.newMessage(data)

        const receiverSocketId = app.getReceiverSocketId(data.receiverId);

        if (receiverSocketId) {
            const io = app.getIO()
            io.to(data.receiverId).emit("newMessage", newMessage);
        }
        return newMessage;
    }

}