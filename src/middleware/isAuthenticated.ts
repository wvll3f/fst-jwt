import { verify } from "../libs/jwt"
import { Itoken } from "../interfaces/auth.interface"
import { UserService } from "../services/user.service"

const userService = new UserService

export async function tokenSplit(rawtoken: string) {
    const tokenparts = rawtoken.split('Bearer ')
    const accessToken = tokenparts?.[1]
    return accessToken
}

export async function isAuthenticated(req, reply) {
    const rawtoken = req.headers?.authorization
    const accessToken = await tokenSplit(rawtoken)
    

    if (accessToken.includes('{{accessToken}}')) return reply.code(401).send({
        error: 'invalid token'
    })

    const payload = await verify(accessToken) as Itoken
    req.userId = payload.id;

    if (!payload) {
        return reply.code(401).send({
            error: 'invalid token'
        })
    }
    console.log(payload)

    return payload.id;
}

export async function admAuthenticated(request, reply) {
    const rawtoken = request.headers?.authorization
    const accessToken = await tokenSplit(rawtoken)

    if (accessToken.includes('{{accessToken}}')) return reply.code(401).send({
        error: 'invalid token'
    })

    const payload: Itoken = await verify(accessToken) as Itoken

    const user = await userService.findbyId(payload.id)

    if (user.role === 'BASIC') {
        return reply.code(401).send({
            error: 'invalid token'
        })
    }
}