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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse as ApiSwaggerResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('auth')
@UseFilters(AuthExceptionFilter)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '사용자 등록',
    description: '새로운 사용자를 등록합니다.',
  })
  @ApiSwaggerResponse({
    status: 201,
    description: '사용자가 성공적으로 등록되었습니다.',
  })
  @ApiBadRequestResponse({ description: '잘못된 요청 데이터' })
  @ApiSwaggerResponse({ status: 409, description: '이미 존재하는 사용자' })
  @ApiBody({ type: CreateUserDto })
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
  @ApiOperation({ summary: '로그인', description: '사용자 인증 및 토큰 발급' })
  @ApiSwaggerResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
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
  @ApiOperation({
    summary: '토큰 갱신',
    description: '리프레시 토큰을 사용하여 새 액세스 토큰 발급',
  })
  @ApiSwaggerResponse({ status: 200, description: '토큰 갱신 성공' })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 리프레시 토큰' })
  @ApiBody({ type: RefreshTokenDto })
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
  @ApiOperation({ summary: '로그아웃', description: '사용자 로그아웃 처리' })
  @ApiSwaggerResponse({ status: 200, description: '로그아웃 성공' })
  @ApiBadRequestResponse({ description: '이메일 누락' })
  @ApiUnauthorizedResponse({ description: '사용자를 찾을 수 없음' })
  @ApiInternalServerErrorResponse({ description: '로그아웃 실패' })
  @ApiBody({ schema: { properties: { email: { type: 'string' } } } })
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
