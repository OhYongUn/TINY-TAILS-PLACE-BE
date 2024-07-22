import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@app/common/auth/auth.service'; // 공통 모듈에서 AuthService 임포트

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    // 이메일과 비밀번호를 사용하여 사용자를 검증합니다.
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    // user가 null이 아니라면 로그인이 성공적으로 이루어진 것입니다.
    if (user) {
      return this.authService.login(user); // 로그인 성공 시 토큰 발행
    } else {
      throw new UnauthorizedException('Login failed'); // 로그인 실패 시 예외 처리
    }
  }
}
