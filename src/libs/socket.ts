import Fastify from "fastify";
import { Server } from "socket.io";
import http from "http";

class SocketServer {
  private userSocketMap: Record<string, string> = {};
  private fastify;
  private server;
  private io;

  constructor() {
    this.fastify = Fastify();
    this.server = http.createServer(this.fastify.server);
    this.io = new Server(this.server, {
      cors: {
        origin: ["http://localhost:5173"],
      },
    });
    this.initializeSocketEvents();
  }

  getReceiverSocketId(userId: string): string | undefined {
    return this.userSocketMap[userId];
  }

  private initializeSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      const userId = socket.handshake.query.userId as string;
      if (userId) this.userSocketMap[userId] = socket.id;


      this.io.emit("getOnlineUsers", Object.keys(this.userSocketMap));

      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        if (userId) delete this.userSocketMap[userId];
        this.io.emit("getOnlineUsers", Object.keys(this.userSocketMap));
      });
    });
  }

  async start(port: number) {
    try {
      await this.fastify.listen({ port });
      console.log(`Server running on http://localhost:${port}`);
    } catch (err) {
      console.error("Error starting server:", err);
      process.exit(1);
    }
  }
}

const socketServer = new SocketServer();
export { SocketServer, socketServer as default };
socketServer.start(3000);
