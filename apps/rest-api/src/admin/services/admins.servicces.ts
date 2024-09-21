import { Injectable } from '@nestjs/common';
import { Admin, Department, Prisma } from '@prisma/client';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { SearchParamsDto } from '@apps/rest/admin/dto/search-params.dto';

interface DepartmentWithChildren extends Department {
  children?: DepartmentWithChildren[];
}

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AdminCreateInput): Promise<Admin> {
    return this.prisma.admin.create({ data });
  }

  async findAll(params: SearchParamsDto) {
    const {
      searchOption,
      searchQuery,
      sortOption,
      page = 1,
      pageSize = 10,
      isActive,
      departmentId,
    } = params;

    const where: Prisma.AdminWhereInput = {};
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
    if (isActive !== undefined) {
      // 문자열 "true"를 불리언 true로, 그 외의 값은 false로 변환
      where.isActive = isActive ? true : false;
    }
    if (departmentId) {
      where.departmentId = departmentId;
    }

    let orderBy: Prisma.AdminOrderByWithRelationInput = { createdAt: 'desc' };

    if (sortOption) {
      const [field, direction] = sortOption.split('_') as [
        string,
        Prisma.SortOrder,
      ];
      if (field in Prisma.AdminScalarFieldEnum) {
        orderBy = { [field]: direction };
      }
    }

    const totalCount = await this.prisma.admin.count({ where });
    const totalPages = Math.ceil(totalCount / pageSize);
    const admins = await this.prisma.admin.findMany({
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
        department: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log('admins->', admins);

    return {
      list: admins,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: string): Promise<Admin | null> {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.AdminUpdateInput): Promise<Admin> {
    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Admin> {
    return this.prisma.admin.delete({ where: { id } });
  }

  async getDepartments() {
    const allDepartments = await this.prisma.department.findMany({
      where: { isActive: true },
    });

    const departmentMap = new Map<string, DepartmentWithChildren>();
    const rootDepartments: DepartmentWithChildren[] = [];

    // 모든 부서를 맵에 추가
    allDepartments.forEach((dept) => {
      departmentMap.set(dept.id, { ...dept, children: [] });
    });

    // 부모-자식 관계 구성
    allDepartments.forEach((dept) => {
      if (dept.parentId) {
        const parent = departmentMap.get(dept.parentId);
        if (parent) {
          parent.children?.push(departmentMap.get(dept.id)!);
        }
      } else {
        rootDepartments.push(departmentMap.get(dept.id)!);
      }
    });

    // children 배열이 비어있으면 제거
    const removeEmptyChildren = (dept: DepartmentWithChildren) => {
      if (dept.children?.length === 0) {
        delete dept.children;
      } else {
        dept.children?.forEach(removeEmptyChildren);
      }
    };

    rootDepartments.forEach(removeEmptyChildren);

    return {
      list: rootDepartments,
    };
  }
}
