import { Module } from '@nestjs/common';
import { RestApiController } from './rest-api.controller';
import { RestApiService } from './rest-api.service';
import { CommonModule } from '@app/common/common.module'; // CommonModule의 경로에 따라 조정 필요


@Module({
  imports: [CommonModule],
  controllers: [RestApiController],
  providers: [RestApiService],
})
export class RestApiModule {}
