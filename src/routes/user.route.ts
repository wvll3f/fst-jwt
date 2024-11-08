import { FastifyInstance } from 'fastify';
import { isAuthenticated, admAuthenticated } from '../middleware/isAuthenticated'
import { UserCreate } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
interface IbodyFind {
    id: string;
}

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

    fastify.delete<{ Body: IbodyFind }>('/delete', async (req, reply) => {
        const id = req.body.id as string;
        try {
            const data = await userService.deleteById(id);
            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });

    fastify.get('/list', { preHandler: admAuthenticated }, async (req, reply) => {
        const result = await userService.findAll()
        reply.code(200).send(result)
    })


}