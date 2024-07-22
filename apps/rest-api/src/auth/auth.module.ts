import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from '@app/common/auth/auth.service'; // 공통 모듈에서 AuthService 임포트

@Module({
  controllers: [AuthController], // 컨트롤러 등록
  providers: [AuthService], // 서비스 등록
})
export class AuthModule {}
