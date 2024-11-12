import { AuthService } from './../services/auth.service';
import { FastifyInstance } from 'fastify';
import { UserSignIn } from '../interfaces/user.interface';
import { isAuthenticated } from '../middleware/isAuthenticated';

interface passwordModify {
    password: string
    oldPassword: string,
}
interface ITokenRefresh {
    refreshToken:string
}

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

    fastify.post<{ Body: passwordModify }>('/recorvery', {
        preHandler: isAuthenticated,
        handler: async (req, reply) => {
            const { password, oldPassword } = req.body;
            const token = req.headers.authorization!;
            try {
                const result = await authService.modifyPassword({ token, password, oldPassword });
                return reply.code(200).send(result);
            } catch (error) {
                reply.code(401).send(error);
            }
        },
    });

    fastify.post<{Body:ITokenRefresh}>('/refresh', async (req, reply)=>{
        const refresh = req.body.refreshToken;
        authService.refreshAccessToken(refresh);
    })

}