import fastify, { FastifyInstance } from "fastify";
import { Server as ioServer, Socket } from 'socket.io'
import { createServer, IncomingMessage, ServerResponse, Server } from 'http';



const serverFactory = (
    handler: (req: IncomingMessage, res: ServerResponse) => void,
    opts: any
): Server => {
    const server = createServer((req, res) => {
        console.log(`Custom Log: ${req.method} ${req.url}`);
        handler(req, res);
    });

    const io = new ioServer(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    setupSocketIO();
    getOnlineUsers();
    return server;
}


export function setupSocketIO() {
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

export function getOnlineUsers() {

    this.io.on("connection", (socket) => {
        console.log("A user connected " + socket.id);

        const userId = socket.handshake.query.userId as string;
        if (userId) this.userSocketMap[userId] = socket.id;

        this.io.emit("getOnlineUsers", Object.keys(this.userSocketMap));

        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
            delete this.userSocketMap[userId];
            this.io.emit("getOnlineUsers", Object.keys(this.userSocketMap));
        });

    });

}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export const userSocketMap = {};

const app: FastifyInstance = fastify({ serverFactory });

export {app};