import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, Min } from 'class-validator';

export class AvailableRoomsDto {
  @ApiProperty({ example: '2023-08-01' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2023-08-05' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ example: 2, description: '반려동물 수' })
  @IsInt()
  @Min(1)
  petNum: number;
}
