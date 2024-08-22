import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { Prisma, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  AuthException,
  UserNotFoundException,
} from '@app/common/auth/authException/authExceptions';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { CreateUserDto } from '@apps/rest/users/dto/CreateUserDto';
import { AuthErrorCodes } from '@app/common/auth/authException/error-code';
import { UpdatePasswordDto } from '@apps/rest/users/dto/update-password.dto';
import { UpdateUserProfileDto } from '@apps/rest/users/dto/update-user-profile.dto';
import {
  InvalidPasswordException,
  NotStrongPassWord,
  UserException,
} from '@apps/rest/users/exceptions/user-exceptions';
import { ErrorCode } from '@apps/rest/room/exceptions/error-codes';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly DEFAULT_REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async updateUserProfile(
    userEmail: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    // 이메일 변경 시 중복 체크
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.prismaService.user.update({
      where: { email: userEmail },
      data: updateUserProfileDto,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        // 필요한 다른 필드들...
      },
    });
  }

  async changePassword(
    userEmail: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: userEmail },
      });
      if (!user) {
        throw new UserNotFoundException();
      }

      const isPasswordValid = await bcryptjs.compare(
        updatePasswordDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new InvalidPasswordException();
      }

      if (!this.isStrongPassword(updatePasswordDto.newPassword)) {
        throw new NotStrongPassWord();
      }

      const hashedNewPassword = await bcryptjs.hash(
        updatePasswordDto.newPassword,
        10,
      );

      await this.prismaService.user.update({
        where: { email: userEmail },
        data: { password: hashedNewPassword },
      });
    } catch (error) {
      this.logger.error(
        `Failed to change password: ${error.message}`,
        error.stack,
      );
      if (!(error instanceof UserException)) {
        throw new UserException(
          new ErrorCode('INTERNAL_SERVER_ERROR', 500, 'Internal Server Error'),
          'An unexpected error occurred',
        );
      }
      throw error;
    }
  }

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
      this.logger.error(`User creation failed: ${err.message}`, err.stack);

      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new AuthException(AuthErrorCodes.EMAIL_ALREADY_IN_USE);
      }

      if (err instanceof AuthException) {
        throw err;
      }

      throw new AuthException(AuthErrorCodes.REGISTRATION_FAILED);
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput): Promise<User> {
    this.logger.log(`사용자 검색 시도: ${JSON.stringify(filter)}`);
    const user = await this.prismaService.user.findUnique({ where: filter });
    if (!user) {
      this.logger.warn(`사용자를 찾을 수 없음: ${JSON.stringify(filter)}`);
      throw new UserNotFoundException();
    }
    return user;
  }

  async removeCurrentRefreshToken(email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException(
        'Email is required to remove refresh token',
      );
    }
    const currentRefreshToken = null;
    const currentRefreshTokenExp = null;
    await this.updateUser(email, currentRefreshToken, currentRefreshTokenExp);
  }

  async getUserForRefreshToken(
    email: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.getUser({ email });
    if (!user || !user.currentRefreshToken) {
      throw new UnauthorizedException('Refresh token not found.');
    }
    const refreshTokenCompare = await bcryptjs.compare(
      refreshToken,
      user.currentRefreshToken,
    );
    if (!refreshTokenCompare) {
      throw new UnauthorizedException('Refresh token is invalid.');
    }
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isStrongPassword(password: string): boolean {
    return password.length >= 8; // 예시: 8자 이상
  }

  private isValidName(name: string): boolean {
    return name.length >= 2; // 예시: 2자 이상
  }

  async updateUser(
    email: string,
    currentRefreshToken: string | null,
    currentRefreshTokenExp: Date | null,
  ): Promise<void> {
    const data = {
      currentRefreshToken,
      currentRefreshTokenExp,
    } as Prisma.UserUpdateInput;
    if (!email) {
      throw new BadRequestException('Email is required to update user');
    }
    try {
      const updatedUser = await this.prismaService.user.update({
        where: { email },
        data,
      });
      if (!updatedUser) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with email ${email} not found`);
        }
      }
      this.logger.error(`Failed to update user: ${email}`, error.stack);
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
