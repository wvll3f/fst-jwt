import { prisma } from '../libs/prisma'
import { User, UserCreate, UserRepository, UserResponse } from '../interfaces/user.interface';
import { Role } from '@prisma/client';
import { hash } from 'argon2';
import { error } from 'console';

class UserRepositoryImplts implements UserRepository {

    async create(data: UserCreate): Promise<UserResponse> {
        const result = await prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
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

        return result as UserResponse;
    }
    async findById(id: string): Promise<UserResponse | null> {
        const result = await prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
            },
        });

        return result as UserResponse || null;
    }
    async deleteById(id: string): Promise<void> {
        const result = await prisma.user.delete({
            where: {
                id,
            },
        });
    }
    async updatePassword(id: string, password: string): Promise<any> {
        const hashPassword = await hash(password)
        try {
            const user = await prisma.user.findUnique({
                where: { id }
            })

            if (!user) throw new Error('user not found')

            const { email, name, active } = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    password: hashPassword as string
                },
            });

            return { email, name, active };

        } catch (err) {
            console.log(err)
            return (err)
        }
    }

    async findAll(): Promise<UserResponse[]> {
        const result = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
            }
        });
        return result;
    }

    async getOthersUsers(userId: string) {
        const result = prisma.user.findMany({
            where: {
                id: {
                    not: userId
                },
            }, select: {
                id: true,
                name: true,
                email: true,
                role: true,
                active: true,
            }
        })
        return result
    }
}

export { UserRepositoryImplts };