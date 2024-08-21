import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayloadDto } from '../dto/accessTokenPayload.dto';
import {AuthService} from "@app/common/auth/auth.service";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'accessToken') {
    private readonly logger = new Logger(AccessTokenStrategy.name);

    constructor(
        private configService: ConfigService,
        private authService: AuthService,
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
            return await this.authService.validateByPayload(payload);
        } catch (error) {
            this.logger.error(`Error validating token: ${error.message}`, error.stack);
            throw new UnauthorizedException('Invalid token');
        }
    }
}