import { IMessage } from "../interfaces/message.interface";
import { prisma } from '../libs/prisma';


class MessageRepository {

    async newMessage(data: IMessage) {

        await prisma.message.create({
            data: {
                senderId: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                image: data.image,
            }
        });
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