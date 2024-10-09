import { UserCreate, UserRepository, UserResponse } from '../interfaces/user.interface';
import { UserRepositoryImplts } from '../repositories/user.repository'

export class UserService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepositoryImplts();
    }

    async create({ email, password, name, role }: UserCreate): Promise<UserResponse> {

        const isUser = await this.userRepository.findByEmail(email);

        if (isUser) {
            throw new Error('User already exists');
        }

        let result: any;

        if (email.length > 0 && password.length > 0 && name.length > 0) {
            result = await this.userRepository.create({ email, password, name, role });
        } else {
            throw new Error('data incomplete');
        }


        return result;
    }

    async update({ email, password, name, role }: UserCreate): Promise<UserResponse> {
        const isUser = await this.userRepository.findByEmail(email);

        if (!isUser) {
            throw new Error('User not exists');
        }

        let result: any;

        if (email.length > 0 && password.length > 0 && name.length > 0) {
            result = await this.userRepository.update({ email, password, name, role });
        } else {
            throw new Error('data incomplete');
        }



        return result;
    }
}

