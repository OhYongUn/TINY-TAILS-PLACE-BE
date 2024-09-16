import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class UpdateBookingOptionDto {
  @ApiProperty({
    description: '예약 상세 ID',
  })
  @IsNumber()
  bookingDetailId: number;

  @ApiProperty({
    description: '요청 옵션',
    enum: ['lateCheckOut', 'earlyCheckin'],
  })
  @IsString()
  @IsIn(['lateCheckOut', 'earlyCheckin'])
  status: 'lateCheckOut' | 'earlyCheckin';
}
