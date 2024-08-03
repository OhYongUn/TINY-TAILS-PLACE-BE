import { IsString } from 'class-validator';
import { UserResponseDto } from '@app/common/users/dto/UserResponseDto';

export class LoginResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  user: UserResponseDto;
}
