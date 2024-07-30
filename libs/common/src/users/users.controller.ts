import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@app/common/users/users.service';
import { CreateUserRequest } from '@app/common/users/dto/create-user.request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() request: CreateUserRequest) {
    return this.usersService.createUser(request);
  }
}
