import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { NewAccessTokenDto } from './dto/newAccessToken.dto';
import { User } from '@prisma/client';
import { LoginResponseDto } from '@app/common/auth/dto/LoginResponseDto';
import {
  InvalidTokenException,
  PasswordWrongException,
  UserAlreadyExistException,
  UserNotFoundException,
} from '@app/common/auth/authException/authExceptions';
import { UsersService } from '@apps/rest/users/users.service';
import { CreateUserDto } from '@apps/rest/users/dto/CreateUserDto';
import { UserResponseDto } from '@apps/rest/users/dto/UserResponseDto';
import { AdminUsersService } from '@apps/rest/admin/services/admin-users.service';
import { TokenService } from '@app/common/auth/token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly adminUsersService: AdminUsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    try {
      await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new UserAlreadyExistException();
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.getUser({ email });
    if (!user) {
      throw new UserNotFoundException();
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new PasswordWrongException();
    }
    return user;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const accessToken: string = await this.tokenService.getAccessToken(user);
    const refreshToken: string = await this.tokenService.getRefreshToken(user);
    await this.usersService.setCurrentRefreshToken(user.email, refreshToken);

    const userResponseDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };
    return { accessToken, refreshToken, user: userResponseDto };
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<NewAccessTokenDto> {
    const { refreshToken } = refreshTokenDto;
    try {
      const userEmail = await this.tokenService.refresh(refreshToken);

      const user = await this.usersService.getUserForRefreshToken(
        userEmail,
        refreshToken,
      );
      const accessToken = await this.tokenService.getAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  async logout(email: string): Promise<void> {
    if (!email) {
      throw new UserNotFoundException();
    }
    await this.usersService.removeCurrentRefreshToken(email);
  }

  async validateAdmin(email: any, password: string) {
    const user = await this.adminUsersService.getAdmin({ email });
    if (!user) {
      throw new UserNotFoundException();
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new PasswordWrongException();
    }
    return user;
  }

  async adminLogin(user) {
    return Promise.resolve(undefined);
  }
}
