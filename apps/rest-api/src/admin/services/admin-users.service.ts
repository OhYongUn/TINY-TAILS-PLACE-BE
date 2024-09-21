import {
  BadRequestException,
  ConflictException,
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
import { SearchParamsDto } from '@apps/rest/admin/dto/search-params.dto';

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
    const { email, password, departmentId, ...rest } = data;

    // 이메일 중복 체크
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (existingAdmin) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcryptjs.hash(password, 10);

    try {
      // 트랜잭션 사용
      const newAdmin = await this.prisma.$transaction(async (prisma) => {
        const admin = await prisma.admin.create({
          data: {
            ...rest,
            email,
            password: hashedPassword,
            departmentId: departmentId,
          },
          include: {
            department: true,
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
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
      throw new InternalServerErrorException(
        '관리자 등록 중 오류가 발생했습니다.',
      );
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

  async getUsers(params: SearchParamsDto) {
    const {
      searchOption,
      searchQuery,
      sortOption,
      page = 1,
      pageSize = 10,
    } = params;
    const where: Prisma.UserWhereInput = {};
    if (searchOption && searchQuery) {
      switch (searchOption) {
        case 'name':
          where.name = { contains: searchQuery };
          break;
        case 'email':
          where.email = { contains: searchQuery };
          break;
        case 'phone':
          where.phone = { contains: searchQuery };
          break;
      }
    }
    let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: 'desc' };

    if (sortOption) {
      const [field, direction] = sortOption.split('_') as [
        string,
        Prisma.SortOrder,
      ];
      if (field in Prisma.UserScalarFieldEnum) {
        orderBy = { [field]: direction };
      }
    }
    const totalCount = await this.prisma.user.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);
    const users = await this.prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });
    console.log('totalCount', totalCount);
    return {
      list: users,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }
}
