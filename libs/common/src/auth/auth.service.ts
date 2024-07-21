import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUserById(userId: number): Promise<any> {
    return await this.usersService.findOneById(userId);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result; // 비밀번호를 제외한 사용자 정보 반환
    }
    return null; // 인증 실패시 null 반환
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });
    // 여기에 리프레쉬 토큰을 데이터베이스에 저장하는 로직 추가
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const payload = { email: decoded.email, sub: decoded.sub };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        }),
      };
    } catch (e) {
      throw new Error('Invalid token');
    }
  }
}
