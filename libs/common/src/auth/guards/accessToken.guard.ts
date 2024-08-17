import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class AccessTokenGuard extends AuthGuard('accessToken') {
  private readonly logger = new Logger(AccessTokenGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.debug('AccessTokenGuard.canActivate가 호출되었습니다');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    this.logger.debug(`Extracted token: ${token ? 'exists' : 'not found'}`);

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

  private extractTokenFromHeader(request: any): string | undefined {
    console.log('extractTokenFromHeader');
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    console.log(
      'extractTokenFromHeader',
      type === 'Bearer' ? token : undefined,
    );
    return type === 'Bearer' ? token : undefined;
  }
}
