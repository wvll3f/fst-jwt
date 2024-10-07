import { UserCreate, UserRepository, UserResponse } from '../interfaces/user.interface';
import { UserRepositoryImplts } from '../repositories/user.repository'

export class UserService {
    private userRepository: UserRepository
    constructor() {
        this.userRepository = new UserRepositoryImplts();
    }

    async create({ email, password, name, role  }: UserCreate): Promise<UserResponse> {
        const verifyIfUserExists = await this.userRepository.findByEmail(email);
        if (verifyIfUserExists) {
            throw new Error('User already exists');
        }
        const result = await this.userRepository.create({ email, password, name, role });

        return result;
    }
}

