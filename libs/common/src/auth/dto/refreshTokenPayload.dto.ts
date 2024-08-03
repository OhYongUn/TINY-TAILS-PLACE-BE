import { IsString } from 'class-validator';

export class RefreshTokenPayloadDto {
  @IsString()
  userEmail: string;
}
