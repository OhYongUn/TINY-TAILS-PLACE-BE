// cancel-booking.dto.ts
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({
    description: '취소할 예약의 ID',
    example: 1,
  })
  @IsInt()
  bookingId: number;
}
