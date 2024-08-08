import { ApiProperty } from '@nestjs/swagger';

export class InitiateBookingResponseDto {
  @ApiProperty()
  bookingNum: string;

  @ApiProperty()
  paymentId: number;

  @ApiProperty()
  totalAmount: number;
}
