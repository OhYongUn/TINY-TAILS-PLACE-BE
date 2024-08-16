import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchRoomsDto {
  @ApiProperty({ example: '2024-09-01' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkInDate: Date;

  @ApiProperty({ example: '2024-09-05' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  checkOutDate: Date;
}
