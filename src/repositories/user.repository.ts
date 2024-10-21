import { prisma } from '../libs/prisma'
import { UserCreate, UserRepository, UserResponse} from '../interfaces/user.interface';
import { Role } from '@prisma/client';
import { hash } from 'argon2';

class UserRepositoryImplts implements UserRepository {

    async create(data: UserCreate): Promise<UserResponse> {
        const result = await prisma.user.create({
            data: {
                email: data.email,
                password: await hash(data.password) as string,
                name: data.name,
                role: data.role! as Role,
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
                password: await hash(data.password) as string,
                role: data.role! as Role
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
    async findById(id: string): Promise<UserResponse | null> {
        const result = await prisma.user.findUnique({
            where: {
                id,
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

    async updatePassword(password: string, id: string): Promise<UserResponse> {
        const hashPassword = await hash(password) 
        const result = await prisma.user.update({
            where: {
                id
            },
            data: {
                password: hashPassword as string
            },
        });
        console.log('>>>>>>> ', + result )
        return result as UserResponse || null;
    }
}

export { UserRepositoryImplts };