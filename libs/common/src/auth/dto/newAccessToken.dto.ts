import { IsString } from 'class-validator';

export class NewAccessTokenDto {
  @IsString()
  accessToken: string;
}
