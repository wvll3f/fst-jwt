import { AuthRepository, ModifypasswordRequest, TokenProps, UserSignIn } from './../interfaces/auth.interface';
import { UserRepositoryImplts } from '../repositories/user.repository';
import { User } from '@prisma/client';
import { verify } from '../libs/argon2';
import { sign } from '../libs/jwt';
import { tokenSplit } from '../middleware/isAuthenticated'
import { verify as jwtVerify } from "../libs/jwt"
import { UserService } from './user.service';

export interface tokenPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

export class AuthService implements AuthRepository {

    private readonly userRepository: UserRepositoryImplts
    private readonly userService: UserService
    constructor() {
        this.userRepository = new UserRepositoryImplts();
        this.userService = new UserService();
    }

    async signIn({ email, password }: UserSignIn): Promise<string> {

        const isUser = await this.userRepository.findByEmail(email) as User
        const validPassword = await verify(isUser.password, password)


        if (!isUser || !validPassword) {
            throw new Error('Incorrect credentials')
        }

        const accessToken = await sign({
            id: isUser.id,
            email: isUser.email
        })

        return accessToken;
    }


    async modifyPassword({ token, password, oldPassword }: ModifypasswordRequest): Promise<any> {
        const accessToken = await tokenSplit(token)
        const validToken = await jwtVerify(accessToken) as TokenProps

        const user = await this.userRepository.findById(validToken.id) as User

        if (!user) {
            throw new Error("user not found");
        }

        const validOldPassword = await verify(user.password, oldPassword)
        console.log(validOldPassword)
        if (!validOldPassword) {
            throw new Error('Invalid old password.')
        }

        try {
            return await this.userRepository.updatePassword(validToken.id, password)
        } catch (err) {
            console.log(err)
        }

    }

    async updateRole(): Promise<void> { }

}