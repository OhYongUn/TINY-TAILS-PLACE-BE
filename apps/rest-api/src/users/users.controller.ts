import {
  Body,
  Controller,
  Put,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UpdatePasswordDto } from '@apps/rest/users/dto/update-password.dto';
import { UsersService } from '@apps/rest/users/users.service';
import { AccessTokenGuard } from '@app/common/auth/guards/accessToken.guard';
import { UpdateUserProfileDto } from '@apps/rest/users/dto/update-user-profile.dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { createSuccessResponse } from '@app/common/utils/api-response.util';
import { UserExceptionFilter } from '@apps/rest/users/exceptions/user-exception.filter';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('users')
@Controller('users')
@UseFilters(UserExceptionFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const userEmail = req.user.email; // JWT payload에서 사용자 ID 추출
    const result = this.usersService.updateUserProfile(
      userEmail,
      updateUserProfileDto,
    );
    return createSuccessResponse(
      {
        user: result,
      },
      200,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: RequestWithUser,
    @Body() changePasswordDto: UpdatePasswordDto,
  ) {
    const userEmail = req.user.email; // JWT payload에서 사용자 ID 추출
    await this.usersService.changePassword(userEmail, changePasswordDto);

    return createSuccessResponse(
      {
        user: req.user,
      },
      200,
    );
  }
}
