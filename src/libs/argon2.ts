import argon2 from "argon2";

export async function verify(hash: string, password: string) {
    try {
        const result = await argon2.verify(hash, password) 
        return result
    } catch (err) {
        console.log('erro verify '+err)
    }
}

export async function hash(password: string) {
    try {
        const result = await argon2.hash(password)
        return result
    } catch (err) {
        console.log(err)
    }
}