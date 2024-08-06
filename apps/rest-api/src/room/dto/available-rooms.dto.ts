import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AvailableRoomsDto {
  @ApiProperty({ example: '2023-08-01' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2023-08-05' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ example: 2, description: '반려동물 수' })
  @IsString()
  @Transform(({ value }) => parseInt(value, 10))
  petNum: string;
}
