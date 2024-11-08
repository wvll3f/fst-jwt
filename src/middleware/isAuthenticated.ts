import { log } from "console"
import { verify } from "../libs/jwt"
import { Itoken } from "../interfaces/auth.interface"
import { UserService } from "../services/user.service"

const userService = new UserService

export async function tokenSplit(rawtoken: string) {
        const tokenparts = rawtoken.split('Bearer ')
        const accessToken = tokenparts?.[1]
        return accessToken
}

export async function isAuthenticated(request, reply) {
    const rawtoken = request.headers?.authorization
    console.log(rawtoken)
    const accessToken = await tokenSplit(rawtoken)
    
    if(accessToken.includes('{{accessToken}}')) return reply.code(401).send({
        error: 'invalid token'
    })

    const payload = await verify(accessToken)

    if (!payload) {
        return reply.code(401).send({
            error: 'invalid token'
        })
    }
}

export async function admAuthenticated(request, reply) {
    const rawtoken = request.headers?.authorization
    const accessToken = await tokenSplit(rawtoken)
    
    if(accessToken.includes('{{accessToken}}')) return reply.code(401).send({
        error: 'invalid token'
    })

    const payload:Itoken = await verify(accessToken)

    const user = await userService.findbyId(payload.id)

    if (user.role === 'BASIC') {
        return reply.code(401).send({
            error: 'invalid token'
        })
    }
}