import { FastifyInstance } from 'fastify';
import { UserCreate } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

export async function userRoutes(fastify: FastifyInstance) {
    const userUseCase = new UserService();
    fastify.post<{ Body: UserCreate }>('/', async (req, reply) => {
        const { name, email, password, role } = req.body;
        try {
            const data = await userUseCase.create({
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

    fastify.get('/', (req, reply) => {
        reply.send({ hello: 'world' });
    });
}