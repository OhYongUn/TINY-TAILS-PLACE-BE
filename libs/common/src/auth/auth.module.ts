import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from '@app/common/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@app/common/auth/strategies/refreshToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthExceptionFilter } from '@app/common/auth/authException/authExceptionFilter';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: 'APP_FILTER',
      useClass: AuthExceptionFilter,
    },
  ],
})
export class AuthModule {}
