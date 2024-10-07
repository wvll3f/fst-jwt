import fastify, { FastifyInstance } from "fastify"

const HOST = process.env.HOST
const PORT = process.env.PORT

const app: FastifyInstance = fastify({
    logger: true
});

app.listen({
    host: HOST,
    port: Number(PORT)
}).then(() => {
    console.log('server running em http://localhost:3333 🚀🚀🚀')
})