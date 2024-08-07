import { ApiProperty } from '@nestjs/swagger';

export class Room {
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
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
