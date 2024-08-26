import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class AdminAccessTokenGuard extends AuthGuard('adminAccessToken') {
  private readonly logger = new Logger(AdminAccessTokenGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('AdminAccessTokenGuard.canActivate가 호출되었습니다');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    this.logger.debug(
      `HandleRequest called: user=${JSON.stringify(user)}, err=${err}, info=${info}`,
    );
    if (err instanceof JsonWebTokenError) {
      this.logger.error(`JWT Error: ${err.message}`);
      throw new UnauthorizedException('Invalid token');
    }
    if (err || !user) {
      this.logger.error(
        `Authentication failed: ${err?.message || 'User not found'}`,
      );
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
