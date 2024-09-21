import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

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
    description: '사용자 비밀번호',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  /*@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      '비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.',
  })*/
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;

  @ApiProperty({
    description: '핸드폰번호',
    example: '010-1234-5678',
  })
  @IsString()
  @Matches(/^010-\d{4}-\d{4}$/, {
    message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)',
  })
  phone: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: '부서 ID',
  })
  @IsOptional()
  @IsString()
  departmentId?: string;
}
