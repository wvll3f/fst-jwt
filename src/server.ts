import 'dotenv/config'

import fastify, { FastifyInstance } from "fastify"
import { userRoutes } from './routes/user.route';
import { authRoutes } from './routes/auth.route';

class app {
  private app: FastifyInstance;
  private HOST:string; 
  private PORT:string; 

  constructor() {
    this.HOST = process.env.HOST!
    this.PORT = process.env.PORT!
    this.app = fastify();
  }

  listen() {
    this.app.listen({
      host: this.HOST,
      port: Number(this.PORT)
    }).then(() => {
      console.log('server running em http://localhost:3333 🚀🚀🚀')
    })
  }

  register(route: any, prefix: string) {
    this.app.register(route, {
      prefix: prefix,
    });
  }

}

const server = new app();

server.listen()
server.register(userRoutes, 'users')
server.register(authRoutes, 'auth')


