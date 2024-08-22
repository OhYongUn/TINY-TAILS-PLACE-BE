import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessTokenStrategy } from '@app/common/auth/strategies/accessToken.strategy';
import { RefreshTokenStrategy } from '@app/common/auth/strategies/refreshToken.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthExceptionFilter } from '@app/common/auth/authException/authExceptionFilter';
import { UsersModule } from '@apps/rest/users/users.module';
import { AdminModule } from '@apps/rest/admin/admin.module';
import { TokenService } from '@app/common/auth/token.service';

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
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    TokenService,
    {
      provide: 'APP_FILTER',
      useClass: AuthExceptionFilter,
    },
  ],
})
export class AuthModule {}
