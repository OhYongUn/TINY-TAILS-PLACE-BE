import { ApiProperty } from '@nestjs/swagger';

export class InitiateBookingResponseDto {
  @ApiProperty()
  bookingNum: string;

  @ApiProperty()
  paymentId: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ required: false, description: '결제 게이트웨이 URL' })
  paymentGatewayUrl?: string;

  // 기타 필요한 추가 정보
}
