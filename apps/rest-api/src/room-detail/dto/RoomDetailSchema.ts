import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';

export class RoomDetailSchema {
  @ApiProperty({ description: '객실 상세 정보 ID' })
  id: number;

  @ApiProperty({ description: '객실 ID' })
  roomId: number;

  @ApiProperty({ description: '객실 번호' })
  roomNumber: string;

  @ApiProperty({ description: '객실 상태', enum: RoomStatus })
  status: RoomStatus;

  @ApiProperty({ description: '현재 체크인 시간', required: false })
  currentCheckIn: Date | null;

  @ApiProperty({ description: '현재 체크아웃 예정 시간', required: false })
  currentCheckOut: Date | null;

  @ApiProperty({ description: '마지막 청소 시간', required: false })
  lastCleaned: Date | null;

  @ApiProperty({ description: '다음 청소 예정 시간', required: false })
  nextCleaning: Date | null;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;
}
