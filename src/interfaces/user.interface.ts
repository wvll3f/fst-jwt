export interface User {
    id: string;
    email: string;
    password: string;
    name: string | null;
    role: Role;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface UserResponse {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    active: boolean;
}

export interface UserCreate {
    email: string;
    password: string;
    name: string;
    role: Role;
}
export interface UserSignIn {
    email: string;
    password: string;
}

export enum Role {
    ADM = 'ADM',
    BASIC = 'BASIC'
}

export interface UserRepository {
    create(data: UserCreate): Promise<UserResponse>;
    update(data: UserCreate): Promise<UserResponse>;
    findByEmail(email: string): Promise<UserResponse | null>;
    deleteById(id: string): Promise<UserResponse | null>;
}