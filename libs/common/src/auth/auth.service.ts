import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccessTokenPayloadDto } from './dto/accessTokenPayload.dto';
import { RefreshTokenPayloadDto } from './dto/refreshTokenPayload.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { NewAccessTokenDto } from './dto/newAccessToken.dto';
import { UsersService } from '@app/common/users/users.service';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from '@app/common/auth/dto/LoginResponseDto';
import { UserResponseDto } from '@app/common/users/dto/UserResponseDto';
import { CreateUserDto } from '@app/common/users/dto/CreateUserDto';
import {
  PasswordWrongException,
  UserNotFoundException,
} from '@app/common/auth/authException/authExceptions';

const DEFAULT_ACCESS_TOKEN_SECRET = 'default_access_token_secret';
const DEFAULT_REFRESH_TOKEN_SECRET = 'default_refresh_token_secret';
const DEFAULT_ACCESS_TOKEN_EXPIRATION = 3600; // 1 hour
const DEFAULT_REFRESH_TOKEN_EXPIRATION = 86400; // 24 hours

@Injectable()
export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: number;
  private readonly refreshTokenExpiration: number;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
      DEFAULT_ACCESS_TOKEN_SECRET,
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      DEFAULT_REFRESH_TOKEN_SECRET,
    );
    this.accessTokenExpiration = this.configService.get<number>(
      'JWT_ACCESS_EXPIRES',
      DEFAULT_ACCESS_TOKEN_EXPIRATION,
    );
    this.refreshTokenExpiration = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES',
      DEFAULT_REFRESH_TOKEN_EXPIRATION,
    );
  }

  async register(CreateUserDto: CreateUserDto): Promise<void> {
    await this.usersService.createUser(CreateUserDto);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUser({ email });
    if (!user) {
      throw new UserNotFoundException(`존재하지않는 사용자입니다.`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new PasswordWrongException('비밀번호가 틀렸습니다.');
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

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<NewAccessTokenDto> {
    const { refreshToken } = refreshTokenDto;
    try {
      const { userEmail } = await this.jwtService.verify(refreshToken, {
        secret: this.refreshTokenSecret,
      });
      const user = await this.usersService.getUserForRefreshToken(
        userEmail,
        refreshToken,
      );
      const accessToken = await this.getAccessToken(user);
      return { accessToken }; // NewAccessTokenDto 형식에 맞게 반환
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async login(user: User): Promise<LoginResponseDto> {
    const accessToken: string = await this.getAccessToken(user);
    const refreshToken: string = await this.getRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.email, refreshToken);

    const UserResponseDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const data = { accessToken, refreshToken, user: UserResponseDto };
    console.log('data', data);
    return data;
  }

  async logout(email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException('Email is required for logout');
    }
    await this.usersService.removeCurrentRefreshToken(email);
  }
}
