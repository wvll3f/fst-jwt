import { FastifyInstance } from "fastify";
import { IMessageRequest, IsendMessage } from "../interfaces/message.interface";
import { MessageService } from "../services/message.service";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { verify } from "../libs/jwt";

export async function messageRoutes(fastify: FastifyInstance) {

    const messageService = new MessageService();

    fastify.post<{ Body: IMessageRequest }>('/new-message/:receiverId', { preHandler: isAuthenticated }, async (req:any, reply) => {

        const {text, image } = req.body;
        const senderId = req.userId;
        const {receiverId} = req.params;

        console.log(`${text} ${image} ${senderId} ${receiverId}`)

        try {
            const data = await messageService.newMenssage({
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

    fastify.get('/:receiverid', { preHandler: isAuthenticated }, async (req: any, reply) => {

        const { receiverid } = req.params;
        const senderId = req.userId;

        try {
            const result = await messageService.findChatMessages(senderId, receiverid)
            reply.code(200).send(result)
        } catch (error) {
            reply.code(401).send(error);
        }

    })

}