import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { authRequest } from '../authRequest';
import { RefreshTokenPayloadDto } from '../dto/refreshTokenPayload.dto';
import { UsersService } from '@apps/rest/users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request.headers?.refresh as string;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: authRequest, payload: RefreshTokenPayloadDto) {
    const refreshToken = req.headers?.refresh as string;
    return await this.usersService.getUserForRefreshToken(
      payload.userEmail,
      refreshToken,
    );
  }
}
