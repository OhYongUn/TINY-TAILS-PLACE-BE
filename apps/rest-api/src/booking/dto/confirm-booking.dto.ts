// confirm-booking.dto.ts
import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmBookingDto {
  @ApiProperty({
    description: '확인할 예약의 ID',
    example: 1,
  })
  @IsInt()
  bookingId: number;

  @ApiProperty({
    description: '결제 방법',
    example: 'credit_card',
    enum: ['credit_card', 'bank_transfer', 'paypal'], // 예시로 몇 가지 결제 방법을 열거했습니다.
  })
  @IsString()
  paymentMethod: string;
}
