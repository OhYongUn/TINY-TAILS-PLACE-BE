import {
  Body,
  Controller,
  HttpStatus,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UpdatePasswordDto } from '@apps/rest/users/dto/update-password.dto';
import { UsersService } from '@apps/rest/users/users.service';
import { AccessTokenGuard } from '@app/common/auth/guards/accessToken.guard';
import { UpdateUserProfileDto } from '@apps/rest/users/dto/update-user-profile.dto';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { UserExceptionFilter } from '@apps/rest/users/exceptions/user-exception.filter';
import { GetUser } from '@app/common/auth/decorators/get-user.decorator';

@ApiTags('users')
@Controller('users')
@UseFilters(UserExceptionFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateProfile(
    @GetUser() user: User,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const userEmail = user.email; // JWT payload에서 사용자 ID 추출
    return this.usersService.updateUserProfile(userEmail, updateUserProfileDto);
  }

  @UseGuards(AccessTokenGuard)
  @Put('change-password')
  async changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: UpdatePasswordDto,
  ) {
    const userEmail = user.email; // JWT payload에서 사용자 ID 추출
    await this.usersService.changePassword(userEmail, changePasswordDto);

    return {
      data: null,
      message: '비밀번호가 변경 되었습니다.',
      statusCode: HttpStatus.ACCEPTED, // 202 상태 코드
    };
  }
}
