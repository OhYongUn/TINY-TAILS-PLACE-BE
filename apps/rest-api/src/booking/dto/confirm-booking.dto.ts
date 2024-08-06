// confirm-booking.dto.ts
import { IsInt, IsString } from 'class-validator';

export class ConfirmBookingDto {
  @IsInt()
  bookingId: number;

  @IsString()
  paymentMethod: string;
}
