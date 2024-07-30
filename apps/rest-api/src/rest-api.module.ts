import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common/common.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CommonModule, UsersModule],
  controllers: [UsersController],
  providers: [],
})
export class RestApiModule {}
