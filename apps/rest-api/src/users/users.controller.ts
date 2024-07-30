import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('')
  async findAll() {
    console.log('user', this.prisma.user.findMany());

    return this.prisma.user.findMany();
  }
}
