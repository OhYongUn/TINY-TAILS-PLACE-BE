import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '객실 ID' })
  @IsInt()
  roomDetailId: number;

  @ApiProperty({ description: '체크인 날짜' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  checkInDate: Date;

  @ApiProperty({ description: '체크아웃 날짜' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  checkOutDate: Date;

  @ApiProperty({ description: '늦은 체크아웃 요청 여부', default: false })
  @IsBoolean()
  requestedLateCheckout: boolean;

  @ApiProperty({ description: '이른 체크인 요청 여부', default: false })
  @IsBoolean()
  requestedEarlyCheckin: boolean;

  @ApiProperty({ description: '반려동물 수', minimum: 1, maximum: 2 })
  @IsInt()
  @Min(1)
  @Max(2)
  petCount: number;

  @ApiProperty({ description: '기본 가격' })
  @IsNumber()
  basePrice: number;

  @ApiProperty({ description: '추가 요금', default: 0 })
  @IsNumber()
  additionalFees: number;

  @ApiProperty({ description: '총 가격' })
  @IsNumber()
  totalPrice: number;

  @ApiPropertyOptional({
    description: '예약 상태',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ description: '특별 요청 사항' })
  @IsString()
  specialRequests?: string;
}
