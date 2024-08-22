// create-admin.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: '관리자 이름',
    example: '홍길동',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: '관리자 이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호 (암호화됨)',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '핸드폰번호',
    example: '010-1231-1231',
  })
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '부서 ID',
  })
  departmentId?: string;

  @ApiPropertyOptional({
    example: ['1', '2'],
    description: '역할 ID 목록',
    type: [String],
  })
  roleIds?: string[];
}
