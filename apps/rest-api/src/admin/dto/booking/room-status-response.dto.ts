// dto/room-status-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class RoomStatusDto {
  @ApiProperty()
  date: string;

  @ApiProperty()
  status: BookingStatus | null;
}

export class RoomDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  roomNumber: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [RoomStatusDto] })
  status: RoomStatusDto[];
}

export class RoomStatusResponseDto {
  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;

  @ApiProperty({ type: [RoomDto] })
  rooms: RoomDto[];
}
