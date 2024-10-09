import { prisma } from '../libs/prisma'
import { User, UserCreate, UserRepository, UserResponse, } from '../interfaces/user.interface';
import { error } from 'console';

class UserRepositoryImplts implements UserRepository {

    async create(data: UserCreate): Promise<UserResponse> {
        const result = await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                role: data.role,
            },
        });
        return result as UserResponse;
    }

    async update(data: UserCreate): Promise<UserResponse> {

        const result = await prisma.user.update({
            where: {
                email: data.email,
            },
            data: {
                name: data.name,
                password: data.password,
                role: data.role
            },
        });


        return result as UserResponse;
    }

    async findByEmail(email: string): Promise<UserResponse | null> {
        const result = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        return result as UserResponse || null;
    }

    async deleteById(id: string): Promise<UserResponse | null> {
        const result = await prisma.user.delete({
            where: {
                id,
            },
        });

        return result as UserResponse || null;
    }

}

export { UserRepositoryImplts };