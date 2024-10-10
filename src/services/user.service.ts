import { UserCreate, UserRepository, UserResponse, UserUpdate } from '../interfaces/user.interface';
import { hash } from '../libs/argon2';
import argon2 from 'argon2'
import { UserRepositoryImplts } from '../repositories/user.repository'

export class UserService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepositoryImplts();
    }

    async create({ email, password, name, role }: UserCreate): Promise<UserResponse> {

        const isUser = await this.userRepository.findByEmail(email);
        const hashpass = await argon2.hash(password) as string
        console.log(`hash pass: ${hashpass}`)
        if (isUser) {
            throw new Error('User already exists');
        }

        let result: any;

        if (email.length > 0 && password.length > 0 && name!.length > 0) {
            result = await this.userRepository.create({
                email,
                password,
                name,
                role
            });
        } else {
            throw new Error('data incomplete');
        }


        return result;
    }

    async update({ email, password, name, role }: UserUpdate): Promise<UserResponse> {
        const isUser = await this.userRepository.findByEmail(email!);

        if (!isUser) {
            throw new Error('User not exists');
        }

        let result: any;

        if (email!.length > 0 && password!.length > 0 && name!.length > 0) {
            result = await this.userRepository.update({
                email:email!,
                password: await hash(password!) as string,
                name:name!,
                role:role!
            });
        } else {
            throw new Error('data incomplete');
        }



        return result;
    }

}

