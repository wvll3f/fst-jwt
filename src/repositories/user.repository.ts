import { prisma } from '../libs/prisma'
import { User, UserCreate, UserRepository } from '../interfaces/user.interface';

class UserRepositoryPrisma implements UserRepository {
    async create(data: UserCreate): Promise<User> {
        const result = await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
                role: data.role,
            },
        });
        return result;
    }

    async update(data: UserCreate): Promise<User> {
        const result = await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                name: data.name,
            },
        });
        return result;
    }


    async findByEmail(email: string): Promise<User | null> {
        const result = await prisma.user.findFirst({
            where: {
                email,
            },
        });

        return result || null;
    }

    async deleteById(id: string): Promise<User | null> {
        const result = await prisma.user.deleteById({
            where: {
                id,
            },
        });

        return result || null;
    }

}

export { UserRepositoryPrisma };