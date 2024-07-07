import { Module } from '@nestjs/common';
import { WebsoketController } from './websoket.controller';
import { WebsoketService } from './websoket.service';

@Module({
  imports: [],
  controllers: [WebsoketController],
  providers: [WebsoketService],
})
export class WebsoketModule {}
