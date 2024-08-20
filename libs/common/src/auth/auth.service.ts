import {Injectable, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {AccessTokenPayloadDto} from './dto/accessTokenPayload.dto';
import {RefreshTokenPayloadDto} from './dto/refreshTokenPayload.dto';
import {RefreshTokenDto} from './dto/refreshToken.dto';
import {NewAccessTokenDto} from './dto/newAccessToken.dto';
import {User} from '@prisma/client';
import {ConfigService} from '@nestjs/config';
import {LoginResponseDto} from '@app/common/auth/dto/LoginResponseDto';
import {
    InvalidTokenException,
    PasswordWrongException,
    UserAlreadyExistException,
    UserNotFoundException,
} from '@app/common/auth/authException/authExceptions';
import {UsersService} from '@apps/rest/users/users.service';
import {CreateUserDto} from '@apps/rest/users/dto/CreateUserDto';
import {UserResponseDto} from '@apps/rest/users/dto/UserResponseDto';
import {AdminService} from "@apps/rest/admin/admin.service";

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
        private readonly adminService: AdminService,
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

    async register(createUserDto: CreateUserDto): Promise<void> {
        try {
            await this.usersService.createUser(createUserDto);
        } catch (error) {
            throw new UserAlreadyExistException();
        }
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.getUser({email});
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
        const accessToken: string = await this.getAccessToken(user);
        const refreshToken: string = await this.getRefreshToken(user);
        await this.usersService.setCurrentRefreshToken(user.email, refreshToken);

        const userResponseDto: UserResponseDto = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
        };
        return {accessToken, refreshToken, user: userResponseDto};
    }

    async refresh(refreshTokenDto: RefreshTokenDto): Promise<NewAccessTokenDto> {
        const {refreshToken} = refreshTokenDto;
        try {
            const {userEmail} = await this.jwtService.verify(refreshToken, {
                secret: this.refreshTokenSecret,
            });
            const user = await this.usersService.getUserForRefreshToken(
                userEmail,
                refreshToken,
            );
            const accessToken = await this.getAccessToken(user);
            return {accessToken};
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

    private async getAccessToken(user: User): Promise<string> {
        const payload: AccessTokenPayloadDto = {
            userEmail: user.email,
            userName: user.name,
        };
        return this.jwtService.sign(payload, {
            secret: this.accessTokenSecret,
            expiresIn: this.accessTokenExpiration,
        });
    }

    private async getRefreshToken(user: User): Promise<string> {
        const payload: RefreshTokenPayloadDto = {
            userEmail: user.email,
        };
        return this.jwtService.sign(payload, {
            secret: this.refreshTokenSecret,
            expiresIn: this.refreshTokenExpiration,
        });
    }

    async validateAdmin(email: string, password: string): Promise<any> {

        const admin = await this.adminService.getAdmin({email});
        if (admin && await bcrypt.compare(password, admin.password)) {
            const {password, ...result} = admin;
            return {...result, role: 'admin'};
        }
        return null;

    }
}
