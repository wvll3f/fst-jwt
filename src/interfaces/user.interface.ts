export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Role;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserCreate {
    email: string;
    password: string;
    name: string;
    role: Role;
}

export enum Role{
    ADM,
    BASIC
}

export interface UserRepository {
    create(data: UserCreate): Promise<User>;
    update(data: UserCreate): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    deleteById(id: string): Promise<User | null>;
}