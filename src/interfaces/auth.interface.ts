export interface UserSignIn {
    email: string;
    password: string;
}
export interface ModifypasswordRequest {
    id: string;
    token: string;
    password: string;
}

export interface AuthRepository {
    signIn({ email, password }: UserSignIn): Promise<any>;
    modifyPassword({ id, token, password }: ModifypasswordRequest): Promise<void>;
    updateRole():Promise<void>;
}