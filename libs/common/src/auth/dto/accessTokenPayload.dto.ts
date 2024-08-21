import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenPayloadDto {
  @ApiProperty({
    description: '사용자 이메일',
    example: 'user@example.com',
  })
  @IsString()
  userEmail: string;

  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsString()
  userName: string;
}
