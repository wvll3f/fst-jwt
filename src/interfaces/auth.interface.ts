export interface UserSignIn {
    email: string;
    password: string;
}
export interface ModifypasswordRequest {
    token: string;
    password: string;
    oldPassword:string;
}
export interface TokenProps {
    id:string;
    accessToken:string;
    expiresIn:string;
}

export interface Itoken{
    id: string,
    email: string,       
    iat: number,
    exp: number
  }

export interface AuthRepository {
    signIn({ email, password }: UserSignIn): Promise<any>;
    modifyPassword({token, password}:ModifypasswordRequest): Promise<void>;
    updateRole(): Promise<void>;
}