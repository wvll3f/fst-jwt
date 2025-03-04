import { IMessageRequest } from "../interfaces/message.interface";
import { prisma } from '../libs/prisma';


class MessageRepository {

    async newMessage(data: IMessageRequest) {

        const result = await prisma.message.create({
            data: {
                senderId: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                image: 'none',
            }
        });

        return result
    }

    async findChatMessages(senderId: string, receiverId: string) {
        const result = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }
        })
        return result;
    }

}

export { MessageRepository }