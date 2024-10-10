import { AuthService } from './../services/auth.service';
import { FastifyInstance } from 'fastify';
import { UserSignIn } from '../interfaces/user.interface';

export async function authRoutes(fastify: FastifyInstance) {

    const authService = new AuthService();

    fastify.post<{ Body: UserSignIn }>('/login', async (req, reply) => {
        const { email, password } = req.body;
        try {
            const data = await authService.signIn({
                email,
                password,
            });
            return reply.code(200).send(data);
        } catch (error) {
            reply.code(401).send(error);
        }
    });


}