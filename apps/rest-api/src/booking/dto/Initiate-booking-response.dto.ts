import { ApiProperty } from '@nestjs/swagger';

export class InitiateBookingResponseDto {
  @ApiProperty()
  bookingId: string;

  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  totalAmount: number;
}
