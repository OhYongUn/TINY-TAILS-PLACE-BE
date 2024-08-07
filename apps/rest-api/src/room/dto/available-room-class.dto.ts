import { ApiProperty } from '@nestjs/swagger';

class AvailableRoomDetailDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  roomNumber: string;
}

export class AvailableRoomClassDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  class: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  capacity: number;

  @ApiProperty()
  size: number;

  @ApiProperty({ type: [String] })
  imageUrls: string[];

  @ApiProperty()
  availableCount: number;

  @ApiProperty({ type: [AvailableRoomDetailDto] })
  availableRoomDetails: AvailableRoomDetailDto[];
}
