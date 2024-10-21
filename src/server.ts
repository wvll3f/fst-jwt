import 'dotenv/config'

import fastify, { FastifyInstance } from "fastify"
import { userRoutes } from './routes/user.route';
import { authRoutes } from './routes/auth.route';

const HOST = process.env.HOST
const PORT = process.env.PORT

const app: FastifyInstance = fastify();

app.register(userRoutes, {
    prefix: '/users',
  });
app.register(authRoutes, {
    prefix: '/auth',
  });

app.listen({
    host: HOST,
    port: Number(PORT)
}).then(() => {
    console.log('server running em http://localhost:3333 🚀🚀🚀')
})