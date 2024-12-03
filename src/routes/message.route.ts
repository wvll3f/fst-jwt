import { FastifyInstance } from "fastify";
import { IMessage } from "../interfaces/message.interface";
import { MessageService } from "../services/message.service";

export async function messageRoutes(fastify: FastifyInstance) {

    const messageService = new MessageService();

    fastify.post<{ Body: IMessage }>('/new-message', async (req, reply) => {
        const { id, senderId, receiverId, text, image } = req.body;
        try {
            const data = await messageService.newMenssage({
                id,
                senderId,
                receiverId,
                text,
                image
            });
            return reply.code(200).send(data);
        } catch (error) {
            reply.code(401).send(error);
        }
      
    });

}