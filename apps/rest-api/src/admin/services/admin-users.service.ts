import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { Admin, Prisma } from '@prisma/client';
import { UserNotFoundException } from '@app/common/auth/authException/authExceptions';

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAdmin(filter: Prisma.AdminWhereUniqueInput): Promise<Admin> {
    this.logger.log(`사용자 검색 시도: ${JSON.stringify(filter)}`);
    const admin = await this.prisma.admin.findUnique({ where: filter });
    if (!admin) {
      this.logger.warn(`사용자를 찾을 수 없음: ${JSON.stringify(filter)}`);
      throw new UserNotFoundException();
    }
    return admin;
  }
}
