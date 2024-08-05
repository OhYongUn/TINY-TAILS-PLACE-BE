import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '@app/common/auth/guards/local.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { ApiResponse } from '@app/common/interface/ApiResponse';
import { LoginResponseDto } from '@app/common/auth/dto/LoginResponseDto';
import { AuthExceptionFilter } from '@app/common/auth/authException/authExceptionFilter';
import {
  PasswordWrongException,
  UserAlreadyExistException,
  UserNotFoundException,
} from '@app/common/auth/authException/authExceptions';
import { RefreshTokenDto } from '@app/common/auth/dto/refreshToken.dto';
import { CreateUserDto } from '@apps/rest/users/dto/CreateUserDto';

interface RequestWithUser extends Request {
  user: User;
}

@UseFilters(AuthExceptionFilter)
@Controller('auth') // 'auth'는 이 컨트롤러의 라우트 접두사입니다.
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<void>> {
    try {
      await this.authService.register(createUserDto);
      return { success: true };
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw error;
      }
      throw new UserAlreadyExistException(
        'Registration failed. Please try again.',
      );
    }
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<LoginResponseDto>> {
    try {
      const loginResponse = await this.authService.login(req.user);
      return { success: true, data: loginResponse };
    } catch (error) {
      if (
        error instanceof PasswordWrongException ||
        error instanceof UserNotFoundException
      ) {
        throw error;
      }
      throw new PasswordWrongException(
        'Login failed. Please check your credentials.',
      );
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    try {
      const newAccessToken = await this.authService.refresh(refreshTokenDto);
      return {
        success: true,
        data: { accessToken: newAccessToken.accessToken },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('email') email: string): Promise<ApiResponse<void>> {
    if (!email) {
      throw new BadRequestException('Email is required for logout');
    }
    try {
      await this.authService.logout(email);
      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('User not found');
      }
      throw new InternalServerErrorException('Logout failed');
    }
  }
}
