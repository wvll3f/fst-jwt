import { AuthService } from './../services/auth.service';
import { FastifyInstance } from 'fastify';
import { UserSignIn } from '../interfaces/user.interface';
import { isAuthenticated, tokenSplit } from '../middleware/isAuthenticated';
import { server as app } from "../server";

interface passwordModify {
    password: string
    oldPassword: string,
}
interface ITokenRefresh {
    refreshToken: string
}

export async function authRoutes(fastify: FastifyInstance) {

    const authService = new AuthService();

    fastify.post<{ Body: UserSignIn }>('/login', async (req, reply) => {
        const { email, password } = req.body;

        try {
            const result = await authService.signIn({
                email,
                password,
            });

            reply.setCookie('jwt', result.accessToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            }).send(result)

            return reply.code(200).send(result)

        } catch (error) {
            console.log(error)
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

    fastify.post<{ Body: ITokenRefresh }>('/refresh', async (req, reply) => {
        const refresh = req.body.refreshToken;
        authService.refreshAccessToken(refresh);
    })

    fastify.get('/check', { preHandler: isAuthenticated }, async (req: any, reply) => {
        const receiverSocketId = await app.getReceiverSocketId(req.userId);
        console.log(receiverSocketId)
        try {
            const token = await tokenSplit(req.headers['authorization']);
            reply.status(200).send(token);
        } catch (error) {
            return reply.code(401).send({
                error: 'invalid token'
            })
        }

    });

}