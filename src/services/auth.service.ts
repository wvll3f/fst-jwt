import { AuthRepository, ModifypasswordRequest, UserSignIn } from './../interfaces/auth.interface';
import { UserRepositoryImplts } from '../repositories/user.repository';
import { UserRepository } from '../interfaces/user.interface';
import { User } from '@prisma/client';
import { verify } from '../libs/argon2';
import { sign } from '../libs/jwt';


export class AuthService implements AuthRepository {

    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepositoryImplts();
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

    async updateRole(): Promise<void> {

    }
    async modifyPassword({ id, token, password }: ModifypasswordRequest): Promise<void> {

    }

}