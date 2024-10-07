import { verify } from "../libs/jwt"

export async function tokenSplit(rawtoken:string){
    const tokenparts = rawtoken.split('Bearer ')
    const accessToken = tokenparts?.[1]
    return accessToken
}


export async function isAuthenticated(request, reply) {
    const rawtoken = request.headers?.authorization
    const accessToken = await tokenSplit(rawtoken)

    const payload = await verify(accessToken)
    console.log(payload)


    if (!payload) {
        return reply.code(401).send({
            error: 'invalid token'
        })
    }
}