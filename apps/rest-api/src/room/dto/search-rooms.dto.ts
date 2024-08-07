import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class SearchRoomsDto {
  @ApiProperty({ example: '2023-08-01' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2023-08-05' })
  @IsDateString()
  checkOutDate: string;
}
