import 'dotenv/config'

import { createServer, IncomingMessage, ServerResponse, Server } from 'http';
import fastify, { FastifyInstance } from "fastify"
import { userRoutes } from './routes/user.route';
import { authRoutes } from './routes/auth.route';
import { Server as ioServer, Socket } from 'socket.io'
import { messageRoutes } from './routes/message.route';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';


class app {
  private app: FastifyInstance;
  private HOST: string;
  private PORT: string;
  private io: ioServer;
  private userSocketMap = {};

  constructor() {
    this.HOST = process.env.HOST || '127.0.0.1'
    this.PORT = process.env.PORT || '3333'

    const serverFactory = (
      handler: (req: IncomingMessage, res: ServerResponse) => void,
      opts: any
    ): Server => {
      const server = createServer((req, res) => {
        console.log(`Custom Log: ${req.method} ${req.url}`);
        handler(req, res);
      });

      this.io = new ioServer(server, {
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      });
      this.setupSocketIO();
      this.getOnlineUsers();
      return server;
    }
    this.app = fastify({ serverFactory });
    this.app.register(fastifyCors, {
      origin: (origin, cb) => {
        const allowedOrigins = ['http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
          cb(null, true);
        } else {
          cb(new Error('Not allowed by CORS'), false);
        }
      },
      credentials: true, 
    });
    this.app.register(fastifyCookie)

  }

  private setupSocketIO() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected:', socket.id);


      socket.on('message', (data) => {
        console.log(`Message from ${socket.id}:`, data);

        socket.emit('response', { success: true, received: data });
      });

      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id} (${reason})`);
      });
    });
  }

  getOnlineUsers() {

    this.io.on("connection", (socket) => {
      console.log("A user connected " + socket.id);

      const userId = socket.handshake.query.all
      if (userId) this.userSocketMap[userId] = socket.id;
      console.log(userId)

      this.io.emit("getOnlineUsers", Object.keys(this.userSocketMap));

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete this.userSocketMap[userId];
        this.io.emit("getOnlineUsers", Object.keys(this.userSocketMap));
      });

    });

  }

  getReceiverSocketId(userId) {
    return this.userSocketMap[userId];
  }

  getIO() {
    return this.io;
  }

  register(route: any, prefix: string) {
    this.app.register(route, {
      prefix: prefix,
    });
  }

  start() {
    this.app.listen({
      host: this.HOST,
      port: Number(this.PORT)
    }).then(() => {
      console.log('server running em http://localhost:3333 🚀🚀🚀')
    })
  }

}

const server = new app();

server.start()
server.register(userRoutes, 'users')
server.register(authRoutes, 'auth')
server.register(messageRoutes, 'chat')

export { server }


