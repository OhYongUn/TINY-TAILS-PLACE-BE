import { ApiProperty } from '@nestjs/swagger';

export class AvailableRoomClassDto {
  @ApiProperty()
  class: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  size: number;

  @ApiProperty({ type: [String] })
  imageUrls: string[];

  @ApiProperty()
  availableRooms: number;

  @ApiProperty({ type: [Date] })
  availableDates: Date[];
}
