import { IsString } from 'class-validator';
import { UserResponseDto } from '@apps/rest/users/dto/UserResponseDto';

export class LoginResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  user: UserResponseDto;
}
