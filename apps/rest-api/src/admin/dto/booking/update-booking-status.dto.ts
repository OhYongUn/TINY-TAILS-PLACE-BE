import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: BookingStatus,
    description: 'New status of the booking',
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiProperty({ required: false, description: 'Reason for the status change' })
  @IsString()
  @IsOptional()
  reason?: string;
}
