import { IrefreshToken } from './../repositories/refreshToken.repository';
import { AuthRepository, ModifypasswordRequest, TokenProps, UserSignIn } from './../interfaces/auth.interface';
import { UserRepositoryImplts } from '../repositories/user.repository';
import { User } from '@prisma/client';
import { verify } from '../libs/argon2';
import { refreshSign, sign } from '../libs/jwt';
import { tokenSplit } from '../middleware/isAuthenticated'
import { verify as jwtVerify } from "../libs/jwt"
import { RefreshTokenRepositoryImplts } from '../repositories/refreshToken.repository';

export interface tokenPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

export class AuthService implements AuthRepository {

    private readonly userRepository: UserRepositoryImplts;
    private readonly tokenRepository: RefreshTokenRepositoryImplts;

    constructor() {
        this.userRepository = new UserRepositoryImplts();
        this.tokenRepository = new RefreshTokenRepositoryImplts();
    }

    async signIn({ email, password }: UserSignIn): Promise<Object> {

        const isUser = await this.userRepository.findByEmail(email) as User;
        const validPassword = await verify(isUser.password, password);

        if (!isUser || !validPassword) {
            throw new Error('Incorrect credentials');
        };

        const accessToken = await sign({
            id: isUser.id,
            email: isUser.email
        });

        const refreshToken = await refreshSign({
            id: isUser.id,
        })

        const data = {
            id: isUser.id,
            refreshToken: refreshToken
        }

        await this.tokenRepository.create(data)

        return {accessToken,refreshToken};
    }

    async modifyPassword({ token, password, oldPassword }: ModifypasswordRequest): Promise<any> {
        
        const accessToken = await tokenSplit(token);
        const validToken = await jwtVerify(accessToken) as TokenProps;

        const user = await this.userRepository.findById(validToken.id) as User;

        if (!user) {
            throw new Error("user not found");
        };

        const validOldPassword = await verify(user.password, oldPassword);


        if (!validOldPassword) {
            throw new Error('Invalid old password.');
        };

        try {
            return await this.userRepository.updatePassword(validToken.id, password);
        } catch (err) {
            console.log(err);
        };

    }

    async updateRole(): Promise<void> { }

    /* async refreshAccessToken(refreshToken: string):Promise<void> {

        const tokenData = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
      
        if (!tokenData || tokenData.expiresAt < new Date()) {
          throw new Error('Refresh token inválido ou expirado');
        }
      
        const payload = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as { userId: number };
        const newAccessToken = sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
      
        return { accessToken: newAccessToken };
      }
        
    } */
}