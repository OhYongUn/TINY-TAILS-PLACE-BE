import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserNotFoundException } from '@apps/rest/users/exceptions/user-exceptions';
import { AdminUsersService } from '@apps/rest/admin/services/admin-users.service';

@Injectable()
export class AdminAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'adminAccessToken',
) {
  private readonly logger = new Logger(AdminAccessTokenStrategy.name);

  constructor(
    private configService: ConfigService,
    private adminUsersService: AdminUsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      ignoreExpiration: false,
    });
    this.logger.log('AccessTokenStrategy initialized');
  }

  async validate(payload: any): Promise<any> {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    try {
      const user = await this.adminUsersService.getAdminByEmail(
        payload.userEmail,
      );
      if (user.email !== payload.userEmail) {
        this.logger.warn(`Username mismatch for user: ${payload.userEmail}`);
        throw new UnauthorizedException('Invalid user information');
      }

      return user;
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
