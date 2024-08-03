import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '@app/common/users/dto/CreateUserDto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(data: CreateUserDto): Promise<Partial<User>> {
    try {
      return await this.prismaService.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: await bcryptjs.hash(data.password, 10),
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('Email already exists.');
      }
      // 다른 종류의 에러에 대해서도 적절한 처리를 추가할 수 있습니다.
      throw new InternalServerErrorException('User creation failed');
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }

  async removeCurrentRefreshToken(email: string): Promise<void> {
    await this.updateUser(email, {
      currentRefreshToken: null,
      currentRefreshTokenExp: null,
    });
  }

  async getHashedRefreshToken(refreshToken: string): Promise<string> {
    return bcryptjs.hash(refreshToken, 10);
  }

  async setCurrentRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<void> {
    const currentRefreshToken = await this.getHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp = this.getRefreshTokenExp();
    await this.updateUser(email, {
      currentRefreshToken,
      currentRefreshTokenExp,
    });
  }

  getRefreshTokenExp(): Date {
    const now = new Date();
    const expirationTime =
      this.configService.get<number>('JWT_REFRESH_EXPIRATION') ||
      7 * 24 * 60 * 60; // 기본값 7일
    return new Date(now.getTime() + expirationTime * 1000);
  }

  async getUserForRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.getUser({ email });
    if (!user.currentRefreshToken) {
      throw new UnauthorizedException('Refresh token not found.');
    }
    const refreshTokenCompare = await bcryptjs.compare(
      refreshToken,
      user.currentRefreshToken,
    );
    if (!refreshTokenCompare) {
      throw new UnauthorizedException('Refresh token is invalid.');
    }
    return user;
  }

  private async updateUser(
    email: string,
    data: Prisma.UserUpdateInput,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { email },
      data,
    });
  }
}
