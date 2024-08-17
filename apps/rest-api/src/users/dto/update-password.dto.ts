import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: '사용자 비밀번호',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: '새로운 비밀번호',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  newPassword: string;
}
