import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { UserDto } from '@app/common/users/dto/userDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  register(@Body() UserDto: UserDto) {
    return this.authService.register(UserDto);
  }
}
