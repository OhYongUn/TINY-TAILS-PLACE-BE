import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { PrismaModule } from '@app/common/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
