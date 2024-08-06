import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@apps/rest/users/dto/UserResponseDto';

export class LoginResponseDto {
  @ApiProperty({
    description: '액세스 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;

  @ApiProperty({
    description: '사용자 정보',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
