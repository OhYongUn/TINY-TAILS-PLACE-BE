import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SearchRoomsDto {
  @ApiProperty({ example: '2024-09-01' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format. Use YYYY-MM-DD',
  })
  checkInDate: string;

  @ApiProperty({ example: '2024-09-05' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Invalid date format. Use YYYY-MM-DD',
  })
  checkOutDate: string;
}
