import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto {
  @ApiProperty({ description: '객실 이름', example: '디럭스 트윈' })
  name?: string;

  @ApiProperty({
    description: '객실 등급',
    example: 'DELUXE',
    enum: ['STANDARD', 'DELUXE', 'SUITE'],
  })
  class?: string;

  @ApiProperty({
    description: '객실 설명',
    example: '넓은 공간과 편안한 트윈 베드를 갖춘 객실',
  })
  description?: string;

  @ApiProperty({ description: '수용 인원', example: 2, minimum: 1 })
  capacity?: number;

  @ApiProperty({ description: '객실 크기 (제곱미터)', example: 30, minimum: 0 })
  size?: number;

  @ApiProperty({
    description: '객실 이미지 URL 목록',
    example: ['http://example.com/room1.jpg', 'http://example.com/room2.jpg'],
    type: [String],
  })
  imageUrls?: string[];
}
