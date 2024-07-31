import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessTokenPayloadDto } from './dto/accessTokenPayload.dto';
import { RefreshTokenPayloadDto } from './dto/refreshTokenPayload.dto';
import { loginTokenDataDto } from './dto/loginTokenData.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { NewAccessTokenDto } from './dto/newAccessToken.dto';
import { UsersService } from '@app/common/users/users.service';
import { User } from '@prisma/client';
import { UserDto } from '@app/common/users/dto/userDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpired: string;
  private readonly refreshTokenExpired: string;

  constructor(
    private readonly usersService: UsersService,
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
    this.accessTokenExpired = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES',
      '3600',
    ); // default to 3600 seconds
    this.refreshTokenExpired = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES',
      '86400',
    ); // default to 86400 seconds
  }

  async register(UserDto: UserDto) {
    await this.usersService.createUser(UserDto);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUser({ email });
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const equalPassword = await bcrypt.compare(password, user.password);
    if (!equalPassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
  }

  async getAccessToken(user: User): Promise<string> {
    const payload: AccessTokenPayloadDto = {
      userEmail: user.email,
      userName: user.name,
    };
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpired,
    });
  }

  async getRefreshToken(user: User): Promise<string> {
    const payload: RefreshTokenPayloadDto = {
      userEmail: user.userEmail,
    };
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpired,
    });
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<NewAccessTokenDto> {
    const { refreshToken } = refreshTokenDto;
    const { userId } = await this.jwtService.verify(refreshToken, {
      secret: this.refreshTokenSecret,
    });
    const user = await this.usersService.getUserForRefreshToken(
      userId,
      refreshToken,
    );
    const newAccessToken = await this.getAccessToken(user);
    return { newAccessToken };
  }

  async login(user: User): Promise<loginTokenDataDto> {
    const accessToken: string = await this.getAccessToken(user);
    const refreshToken: string = await this.getRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.email, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(email: string): Promise<void> {
    await this.usersService.removeCurrentRefreshToken(email);
  }
}
