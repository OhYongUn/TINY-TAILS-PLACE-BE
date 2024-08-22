import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '@app/common/auth/guards/local.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { LoginResponseDto } from '@app/common/auth/dto/LoginResponseDto';
import { AuthExceptionFilter } from '@app/common/auth/authException/authExceptionFilter';
import { RefreshTokenDto } from '@app/common/auth/dto/refreshToken.dto';
import { CreateUserDto } from '@apps/rest/users/dto/CreateUserDto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse as ApiSwaggerResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminLocalGuard } from '@app/common/auth/guards/admin-local-guard';

interface RequestWithUser extends Request {
  user: User;
}

export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

@ApiTags('auth')
@Controller('auth')
@UseFilters(AuthExceptionFilter)
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
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return {
      data: null,
      message: '회원가입이 성공적으로 완료되었습니다.',
      statusCode: HttpStatus.CREATED,
    };
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: '로그인', description: '사용자 인증 및 토큰 발급' })
  @ApiSwaggerResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  async login(@Req() req: RequestWithUser) {
    return await this.authService.login(req.user);
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
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그아웃', description: '사용자 로그아웃 처리' })
  @ApiSwaggerResponse({ status: 200, description: '로그아웃 성공' })
  @ApiBadRequestResponse({ description: '이메일 누락' })
  @ApiUnauthorizedResponse({ description: '사용자를 찾을 수 없음' })
  @ApiBody({ schema: { properties: { email: { type: 'string' } } } })
  async logout(@Body('email') email: string) {
    await this.authService.logout(email);
    return {
      data: null,
      message: '로그아웃 성공',
      statusCode: HttpStatus.OK, // 명시적으로 200 상태 코드 지정
    };
  }
  @Post('/admin/login')
  @UseGuards(AdminLocalGuard)
  async adminLogin(@Req() req) {
    return await this.authService.adminLogin(req.user);
  }
}
