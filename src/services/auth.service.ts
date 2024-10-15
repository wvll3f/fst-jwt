import { AuthRepository, ModifypasswordRequest, TokenProps, UserSignIn } from './../interfaces/auth.interface';
import { UserRepositoryImplts } from '../repositories/user.repository';
import { UserRepository } from '../interfaces/user.interface';
import { User } from '@prisma/client';
import { verify } from '../libs/argon2';
import { sign } from '../libs/jwt';
import { tokenSplit } from '../middleware/isAuthenticated'
import { verify as jwtVerify } from "../libs/jwt"
import { UserService } from './user.service';

export class AuthService implements AuthRepository {

    private readonly userRepository: UserRepository
    private readonly userService: UserService
    constructor() {
        this.userRepository = new UserRepositoryImplts();
        this.userService = new UserService();
    }

    async signIn({ email, password }: UserSignIn): Promise<any> {

        const isUser = await this.userRepository.findByEmail(email) as User
        const validPassword = await verify(isUser.password, password)


        if (!isUser || !validPassword) {
            throw new Error('Incorrect credentials')
        }

        const accessToken = await sign({
            id: isUser.id
        })

        return accessToken;
    }

    async modifyPassword({ token, password }: ModifypasswordRequest): Promise<void> {
        const accessToken = await tokenSplit(token)
        const validToken = await jwtVerify(accessToken) as TokenProps

        const user = await this.userRepository.findById(validToken.id) as User

        if (!user) {
            throw new Error("user not found");
        }

        this.userService.update({  })
    }

    async updateRole(): Promise<void> { }

}