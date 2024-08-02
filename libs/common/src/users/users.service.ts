import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { UserDto } from './dto/userDto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(UserDto: UserDto): Promise<Partial<User>> {
    try {
      return await this.prismaService.user.create({
        data: {
          name: UserDto.name,
          email: UserDto.email,
          password: await bcryptjs.hash(UserDto.password, 10),
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
      throw err;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
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

  async removeCurrentRefreshToken(email: string): Promise<void> {
    await this.updateUser(email, {
      currentRefreshToken: null,
      currentRefreshTokenExp: null,
    });
  }

  async getHashedRefreshToken(refreshToken: string): Promise<string> {
    return bcryptjs.hash(refreshToken, 10);
  }

  getRefreshTokenExp(): Date {
    const now = new Date();
    const refreshTokenExp =
      this.configService.get<number>('JWT_REFRESH_EXPIRATION')! * 1000;
    return new Date(now.getTime() + refreshTokenExp);
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
