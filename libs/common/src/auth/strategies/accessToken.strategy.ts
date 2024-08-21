import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayloadDto } from '../dto/accessTokenPayload.dto';
import { UserNotFoundException } from '@apps/rest/users/exceptions/user-exceptions';
import { UsersService } from '@apps/rest/users/users.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  private readonly logger = new Logger(AccessTokenStrategy.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
    this.logger.log('AccessTokenStrategy initialized');
  }

  async validate(payload: AccessTokenPayloadDto): Promise<any> {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    try {
      const user = await this.usersService.getUser({
        email: payload.userEmail,
      });
      if (user.email !== payload.userEmail) {
        this.logger.warn(`Username mismatch for user: ${payload.userEmail}`);
        throw new UnauthorizedException('Invalid user information');
      }

      return {
        userId: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        this.logger.warn(`User not found for email: ${payload.userEmail}`);
        throw new UnauthorizedException('User not found');
      }
      if (error instanceof UnauthorizedException) {
        throw error; // 이미 UnauthorizedException인 경우 그대로 전달
      }
      this.logger.error(
        `Error validating token: ${error.message}`,
        error.stack,
      );
      throw new UnauthorizedException('Invalid token');
    }
  }
}
