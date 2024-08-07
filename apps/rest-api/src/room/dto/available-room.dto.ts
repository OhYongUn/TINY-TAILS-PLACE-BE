import { ApiProperty } from '@nestjs/swagger';
import { RoomDto } from '@apps/rest/room/dto/room.dto';

export class AvailableRoomDto {
  @ApiProperty({ type: [Date] })
  availableDates: Date[];

  @ApiProperty({ type: [Number] })
  availableCounts: number[];
}
