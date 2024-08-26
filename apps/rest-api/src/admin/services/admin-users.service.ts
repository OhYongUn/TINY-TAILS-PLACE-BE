import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { Admin, Prisma } from '@prisma/client';
import { UserNotFoundException } from '@app/common/auth/authException/authExceptions';
import { CreateAdminDto } from '@app/common/auth/dto/create-admin.dto';
import { UserExceptions } from '@app/common/exceptions/users/user-exceptions';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAdminByEmail(email: string) {
    return this.getAdmin({ email });
  }

  async getAdminById(id: string) {
    return this.getAdmin({ id });
  }

  async getAdmin(filter: Prisma.AdminWhereUniqueInput): Promise<Admin> {
    this.logger.log(`사용자 검색 시도: ${JSON.stringify(filter)}`);
    const admin = await this.prisma.admin.findUnique({ where: filter });
    if (!admin) {
      this.logger.warn(`사용자를 찾을 수 없음: ${JSON.stringify(filter)}`);
      throw new UserNotFoundException();
    }
    return admin;
  }

  async adminRegister(data: CreateAdminDto) {
    const { email, password, roleIds, ...rest } = data;

    // 이메일 중복 체크
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (existingAdmin) {
      throw UserExceptions.emailAlreadyExists();
    }

    // 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 역할 유효성 검사
    if (roleIds && roleIds.length > 0) {
      const validRoles = await this.prisma.role.findMany({
        where: { id: { in: roleIds.map((id) => parseInt(id)) } },
      });
      if (validRoles.length !== roleIds.length) {
        throw new Error('One or more invalid role IDs provided');
      }
    }

    try {
      // 트랜잭션 사용
      const newAdmin = await this.prisma.$transaction(async (prisma) => {
        const admin = await prisma.admin.create({
          data: {
            ...rest,
            email,
            password: hashedPassword,
            AdminRole: {
              create:
                roleIds?.map((roleId) => ({ roleId: parseInt(roleId) })) || [],
            },
          },
          include: {
            department: true,
            AdminRole: {
              include: {
                role: true,
              },
            },
          },
        });

        // 비밀번호 제외
        const { password: _, ...adminWithoutPassword } = admin;
        return adminWithoutPassword;
      });

      this.logger.log(`New admin created: ${newAdmin.id}`);
      return newAdmin;
    } catch (err: any) {
      this.logger.error(`Failed to create admin: ${err.message}`, err.stack);
      if (err.code === 'P2002') {
        throw UserExceptions.emailAlreadyExists();
      }
      throw new Error('Failed to create admin');
    }
  }

  async updateAdmin(
    email: string,
    currentRefreshToken: string | null,
    currentRefreshTokenExp: Date | null,
  ) {
    if (!email) {
      throw new BadRequestException('Email is required to update user');
    }
    try {
      const data = {
        currentRefreshToken,
        currentRefreshTokenExp,
      } as Prisma.AdminUpdateInput;
      const updateAdmin = await this.prisma.admin.update({
        where: { email },
        data,
      });
      if (!updateAdmin) {
        throw UserExceptions.userNotFound();
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw UserExceptions.userNotFound();
        }
        this.logger.error(`Failed to update user: ${email}`, error.stack);
        throw new InternalServerErrorException('Failed to update user');
      }
    }
  }
}
