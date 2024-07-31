import { IsString } from 'class-validator';

export class AccessTokenPayloadDto {
  @IsString()
  userEmail: string;

  @IsString()
  userName: string;
}
