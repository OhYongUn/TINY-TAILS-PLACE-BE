import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';

export class UpdateRoomDetailDto {
  @ApiPropertyOptional({ description: '객실 번호', example: '102' })
  roomNumber?: string;

  @ApiPropertyOptional({
    description: '객실 상태',
    enum: RoomStatus,
    example: RoomStatus.OCCUPIED,
  })
  status?: RoomStatus;

  @ApiPropertyOptional({
    description: '현재 체크인 시간',
    type: Date,
  })
  currentCheckIn?: Date;

  @ApiPropertyOptional({
    description: '현재 체크아웃 예정 시간',
    type: Date,
  })
  currentCheckOut?: Date;

  @ApiPropertyOptional({
    description: '마지막 청소 시간',
    type: Date,
  })
  lastCleaned?: Date;

  @ApiPropertyOptional({
    description: '다음 청소 예정 시간',
    type: Date,
  })
  nextCleaning?: Date;
}
