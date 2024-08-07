import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  class: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  size: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];
}
