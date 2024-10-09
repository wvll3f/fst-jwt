import { FastifyInstance } from 'fastify';
import { UserCreate } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

export async function userRoutes(fastify: FastifyInstance) {

    const userService = new UserService();

    fastify.post<{ Body: UserCreate }>('/', async (req, reply) => {
        const { name, email, password, role } = req.body;
        try {
            const data = await userService.create({
                name,
                email,
                password,
                role
            });
            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });

    fastify.patch<{ Body: UserCreate }>('/update', async (req, reply) => {
        const { name, email, password, role } = req.body;
        try {
            const data = await userService.update({
                name,
                email,
                password,
                role
            });
            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });

}