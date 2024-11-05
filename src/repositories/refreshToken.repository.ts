import { prisma } from "../libs/prisma";
import { refreshSign } from "../libs/jwt";

export interface IrefreshToken {
    id: string,
    refreshToken: string
}

class RefreshTokenRepositoryImplts {

    async create( data: IrefreshToken ) {
        await prisma.refreshToken.create({
            data: {
              userId:data.id,
              token: data.refreshToken,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          }); 
    }

}

export {RefreshTokenRepositoryImplts}