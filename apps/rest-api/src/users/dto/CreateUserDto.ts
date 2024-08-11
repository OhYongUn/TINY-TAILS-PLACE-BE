import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
  @IsString()
  password: string;

  @ApiProperty({
    description: '핸드폰번호',
    example: '010-1231-1231',
  })
  @IsString()
  phone: string;
}
