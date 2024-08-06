import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: '객실 ID' })
  @IsInt()
  roomId: number;

  @ApiProperty({ description: '체크인 날짜' })
  @IsDate()
  @Type(() => Date)
  checkInDate: Date;

  @ApiProperty({ description: '체크아웃 날짜' })
  @IsDate()
  @Type(() => Date)
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

  @ApiProperty({ description: '예약 상태' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ description: '특별 요청 사항' })
  @IsString()
  specialRequests?: string;
}
