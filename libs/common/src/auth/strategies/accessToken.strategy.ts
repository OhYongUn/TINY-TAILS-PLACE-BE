import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayloadDto } from '../dto/accessTokenPayload.dto';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>(
        'JWT_ACCESS_TOKEN_SECRET',
        'default_access_token_secret',
      ),
      ignoreExpiration: false,
    });
  }

  async validate(payload: AccessTokenPayloadDto) {
    return { ...payload };
  }
}
