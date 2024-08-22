import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayloadDto } from '@app/common/auth/dto/accessTokenPayload.dto';
import { RefreshTokenPayloadDto } from '@app/common/auth/dto/refreshTokenPayload.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: number;
  private readonly refreshTokenExpiration: number;
  private readonly DEFAULT_REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds

  private readonly logger = new Logger(TokenService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
      'default_access_token_secret',
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'default_refresh_token_secret',
    );
    this.accessTokenExpiration = this.configService.get<number>(
      'JWT_ACCESS_EXPIRES',
      3600,
    );
    this.refreshTokenExpiration = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES',
      86400,
    );
  }
  async getAccessToken(user: User): Promise<string> {
    const payload: AccessTokenPayloadDto = {
      userEmail: user.email,
      userName: user.name,
    };
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiration,
    });
  }

  async getRefreshToken(user: User): Promise<string> {
    const payload: RefreshTokenPayloadDto = {
      userEmail: user.email,
    };
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiration,
    });
  }

  async getAdminAccessToken(user: any) {
    const payload = {
      userEmail: user.email,
      userName: user.name,
    };
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiration,
    });
  }
  async getAdminRefreshToken(user: any): Promise<string> {
    const payload = {
      userEmail: user.email,
    };
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiration,
    });
  }
  async refresh(refreshToken: string) {
    const { userEmail } = this.jwtService.verify(refreshToken, {
      secret: this.refreshTokenSecret,
    });
    return userEmail;
  }
  getRefreshTokenExp(): Date {
    const now = new Date();
    const expirationTime =
      this.configService.get<number>('JWT_REFRESH_EXPIRATION') ||
      this.DEFAULT_REFRESH_TOKEN_EXPIRATION;

    return new Date(now.getTime() + expirationTime * 1000);
  }
  async getHashedRefreshToken(refreshToken: string): Promise<string> {
    return bcryptjs.hash(refreshToken, 10);
  }
}
