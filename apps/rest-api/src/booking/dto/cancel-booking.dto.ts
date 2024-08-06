// cancel-booking.dto.ts
import { IsInt } from 'class-validator';

export class CancelBookingDto {
  @IsInt()
  bookingId: number;
}
