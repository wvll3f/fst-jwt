import { prisma } from './../libs/prisma';
import { refreshSign } from "../libs/jwt";

export interface IrefreshToken {
  id: string,
  refreshToken: string
}

class RefreshTokenRepositoryImplts {

  async create(data: any) {

    await prisma.refreshToken.create({
      data: {
        userId: data.id,
        token: data.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
  }

  async findUnique(refreshToken: string) {
    const tokenData = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    return tokenData;
  }

}

export { RefreshTokenRepositoryImplts }