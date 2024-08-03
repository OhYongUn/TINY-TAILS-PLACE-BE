import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '@app/common/users/users.service';
import { CreateUserDto } from '@app/common/users/dto/CreateUserDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() request: CreateUserDto) {
    console.log('2');
    return this.usersService.createUser(request);
  }
}
