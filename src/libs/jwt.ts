import jwt from "jsonwebtoken";

import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export async function verify(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (err) {
        console.log(err)
        return false
    }
}

export async function sign(payload) {
    return jwt.sign(payload, JWT_SECRET, {expiresIn:'1h'})
}