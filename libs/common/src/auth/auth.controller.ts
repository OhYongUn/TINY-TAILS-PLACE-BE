import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '@app/common/auth/guards/local.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from '@app/common/users/dto/CreateUserDto';
import { ApiResponse } from '@app/common/interface/ApiResponse';
import { LoginResponseDto } from '@app/common/auth/dto/LoginResponseDto';

interface RequestWithUser extends Request {
  user: User;
}

Controller('auth');

export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ApiResponse<void>> {
    await this.authService.register(createUserDto);
    return { success: true };
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
  ): Promise<ApiResponse<LoginResponseDto>> {
    const loginResponse = await this.authService.login(req.user);
    return { success: true, data: loginResponse };
  }
}
