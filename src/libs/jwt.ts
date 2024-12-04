import jwt from "jsonwebtoken";

import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_KEY as string;

export async function verify(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (err) {
        console.log(err)
        return false
    }
}

export async function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET)
    } catch (err) {
        console.log(err)
        return false
    }
}

export async function sign(payload) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn:'1h'})
}

export async function refreshSign(payload) {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn:'7d'})
}