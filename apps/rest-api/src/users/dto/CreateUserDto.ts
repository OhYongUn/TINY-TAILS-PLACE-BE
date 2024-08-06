import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이름',
    example: '홍길동',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: '사용자 이메일 (고유값)',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '사용자 비밀번호 (암호화됨)',
    example: 'StrongP@ssw0rd!',
  })
  @IsStrongPassword({
    minLength: 8,
    // minLowercase: 1,
    // minUppercase: 1,
    // minNumbers: 1,
    // minSymbols: 1,
  })
  password: string;
}
