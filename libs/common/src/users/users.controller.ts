import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@app/common/users/users.service';
import { UserDto } from '@app/common/users/dto/userDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() request: UserDto) {
    return this.usersService.createUser(request);
  }
}
