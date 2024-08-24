import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refreshToken.dto';
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
import { CreateAdminDto } from '@app/common/auth/dto/create-admin.dto';

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

  async login(user: any): Promise<LoginResponseDto> {
    const accessToken: string = await this.tokenService.getAccessToken(user);
    const refreshToken: string = await this.tokenService.getRefreshToken(user);
    const currentRefreshToken =
      await this.tokenService.getHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp = this.tokenService.getRefreshTokenExp();
    await this.usersService.updateUser(
      user.email,
      currentRefreshToken,
      currentRefreshTokenExp,
    );

    const userResponseDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
    };
    return { accessToken, refreshToken, user: userResponseDto };
  }

  async refresh(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    try {
      const userEmail = await this.tokenService.refresh(refreshToken);

      const user = await this.usersService.getUserForRefreshToken(
        userEmail,
        refreshToken,
      );
      const newAccessToken = await this.tokenService.getAccessToken(user);
      const newRefreshToken = await this.tokenService.getRefreshToken(user);
      const newRefreshTokenExp = this.tokenService.getRefreshTokenExp();

      await this.usersService.updateUser(
        user.email,
        newRefreshToken,
        newRefreshTokenExp,
      );
      return { newAccessToken, newRefreshToken };
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

  async adminLogin(user: any) {
    const accessToken: string = await this.tokenService.getAccessToken(user);
    const refreshToken: string = await this.tokenService.getRefreshToken(user);
    const currentRefreshToken =
      await this.tokenService.getHashedRefreshToken(refreshToken);
    const currentRefreshTokenExp = this.tokenService.getRefreshTokenExp();
    await this.adminUsersService.updateAdmin(
      user.email,
      currentRefreshToken,
      currentRefreshTokenExp,
    );

    return { accessToken, refreshToken, user };
  }

  async adminRegister(createAdminDto: CreateAdminDto) {
    try {
      await this.adminUsersService.adminRegister(createAdminDto);
    } catch (e) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    return this.tokenService.verifyToken(token);
  }
}
