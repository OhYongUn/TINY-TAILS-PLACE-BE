import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client'; // Prisma에서 생성한 enum 사용

export class CreateRoomDetailDto {
  @ApiProperty({ description: '객실 ID', example: 1 })
  roomId: number;

  @ApiProperty({ description: '객실 번호', example: '101' })
  roomNumber: string;

  @ApiProperty({
    description: '객실 상태',
    enum: RoomStatus,
    example: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @ApiProperty({
    description: '마지막 청소 시간',
    required: false,
    type: Date,
  })
  lastCleaned?: Date;

  @ApiProperty({
    description: '다음 청소 예정 시간',
    required: false,
    type: Date,
  })
  nextCleaning?: Date;
}
