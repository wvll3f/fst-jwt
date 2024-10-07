import argon2 from "argon2";

export async function verify(hash: string, password: string) {

    try {
        return argon2.verify(hash, password)
    } catch (err) {
        console.log(err)
    }

}

export async function hash(password: string) {
    try {
       
        return (await argon2.hash(password))
    } catch (err) {
        console.log(err)
    }
}