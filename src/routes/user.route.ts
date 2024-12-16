import { FastifyInstance } from 'fastify';
import { isAuthenticated, admAuthenticated } from '../middleware/isAuthenticated'
import { UserCreate, UserResponse } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';
interface IbodyFind {
    id: string;
}

declare module 'fastify' {
    interface FastifyRequest {
      user: UserResponse;
    }
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

    // fastify.get('/:email', async (req: any, reply) => {
    //     const email = req.params.email;
    //     console.log(`email aqui: ${email}`)
    //     const result = await userService.findbyEmail(email)
    //     reply.code(200).send(result)
    // })

    fastify.get('/sideuser', { preHandler: isAuthenticated }, async (req , reply) => {
        const userId = req.user.id
        try {
            const result = await userService.getOthersUsers(userId)
            reply.code(200).send(result)
        } catch (error) {
            reply.code(404).send(error)
        }

    })

}