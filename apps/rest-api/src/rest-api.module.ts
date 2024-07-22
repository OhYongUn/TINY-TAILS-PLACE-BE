import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common/common.module';
import { AuthModule } from '@app/common/auth/auth.module'; // CommonModule의 경로에 따라 조정 필요
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CommonModule, AuthModule, UsersModule],
  controllers: [AuthController, UsersController],
  providers: [],
})
export class RestApiModule {}
