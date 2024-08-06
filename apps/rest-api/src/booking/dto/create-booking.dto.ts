a; // create-booking.dto.ts
import { IsDate, IsInt, IsBoolean, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsInt()
  userId: number;

  @IsInt()
  roomId: number;

  @IsDate()
  @Type(() => Date)
  checkInDate: Date;

  @IsDate()
  @Type(() => Date)
  checkOutDate: Date;

  @IsBoolean()
  requestedLateCheckout: boolean;

  @IsBoolean()
  requestedEarlyCheckin: boolean;

  @IsInt()
  @Min(1)
  @Max(2)
  petCount: number;

  @IsString()
  specialRequests?: string;
}
