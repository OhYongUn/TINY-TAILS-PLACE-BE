import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewAccessTokenDto {
  @ApiProperty({
    description: '새로운 액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  accessToken: string;
}
