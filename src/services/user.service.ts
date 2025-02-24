import { UserCreate, UserRepository, UserResponse, UserUpdate, User } from '../interfaces/user.interface';
import { hash } from '../libs/argon2';
import argon2 from 'argon2'
import { UserRepositoryImplts } from '../repositories/user.repository'

export class UserService {
    private userRepository: UserRepositoryImplts

    constructor() {
        this.userRepository = new UserRepositoryImplts();
    }

    async create(data: UserCreate): Promise<any> {

        const isUser = await this.userRepository.findByEmail(data.email);
        const hashpass = await argon2.hash(data.password)

        if (isUser) {
            throw new Error('User already exists');
        }

        if (data.email.length > 0 && data.password.length > 0 && data.name!.length > 0) {
            const { id, email, name, role } = await this.userRepository.create({
                email: data.email,
                password: hashpass,
                name: data.name,
                role: data.role
            });
            return { id, email, name, role };
        } else {
            throw new Error('data incomplete');
        }

    }
    async update({ email, password, name, role }: UserUpdate): Promise<UserResponse> {
        const isUser = await this.userRepository.findByEmail(email!);

        if (!isUser) {
            throw new Error('User not exists');
        }

        let result: any;

        if (email!.length > 0 && password!.length > 0 && name!.length > 0) {
            result = await this.userRepository.update({
                email: email!,
                password: await hash(password!) as string,
                name: name!,
                role: role!
            });
        } else {
            throw new Error('data incomplete');
        }
        return result;
    }
    async findbyEmail(email: string) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error('User not exists');

    };
    async findbyId(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error('User not exists');
        return user
    };
    async deleteById(id: string) {
        const user = await this.userRepository.findById(id)
        if (!user) throw new Error('User not exists');

        await this.userRepository.deleteById(id)

        return (`Usuario ${user.email} deletado`)
    }

    async findAll(): Promise<UserResponse[]> {
        const result = await this.userRepository.findAll()

        if (!result || result.length < 1) throw new Error('Nenhum usuario foi encontrador')

        return result
    }
    async getOthersUsers(id: string): Promise<UserResponse[]> {
        const result = await this.userRepository.getOthersUsers(id)

        if (!result) throw new Error('Nenhum usuario foi encontrador')

        return result
    }

}

