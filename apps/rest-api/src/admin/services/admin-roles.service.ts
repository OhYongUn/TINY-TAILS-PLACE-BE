import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { CreateRoleDto } from '@apps/rest/admin/dto/roles/create-role.dto';
import { CreatePermissionDto } from '@apps/rest/admin/dto/roles/create-permission.dto';
import { AssignRoleDto } from '@apps/rest/admin/dto/roles/assign-role.dto';

@Injectable()
export class AdminRolesService {
  constructor(private prisma: PrismaService) {}
  async createRole(createRoleDto: CreateRoleDto) {
    const { name, description, permissionIds } = createRoleDto;
    const existingRole = await this.prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      throw new ConflictException(`Role with name ${name} already exists`);
    }

    const role = await this.prisma.role.create({
      data: {
        name,
        description,
        rolePermissions: {
          create:
            permissionIds?.map((permissionId) => ({ permissionId })) || [],
        },
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return role;
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const { name, description, resource, action } = createPermissionDto;
    const existingPermissionByName = await this.prisma.permission.findUnique({
      where: { name },
    });

    if (existingPermissionByName) {
      throw new ConflictException(
        `Permission with name ${name} already exists`,
      );
    }
    const existingPermission = await this.prisma.permission.findFirst({
      where: { resource, action },
    });

    if (existingPermission) {
      throw new ConflictException(
        `Permission for ${resource}:${action} already exists`,
      );
    }

    return this.prisma.permission.create({
      data: { name, description, resource, action },
    });
  }

  async assignRoleToAdmin(assignRoleDto: AssignRoleDto) {
    const { adminId, roleId } = assignRoleDto;

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} not found`);
    }

    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return this.prisma.adminRole.create({
      data: { adminId, roleId },
      include: {
        admin: true,
        role: true,
      },
    });
  }

  async getRoleWithPermissions(roleId: number) {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role;
  }

  async getAdminRoles(adminId: string) {
    const adminRoles = await this.prisma.adminRole.findMany({
      where: { adminId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!adminRoles.length) {
      throw new NotFoundException(
        `No roles found for admin with ID ${adminId}`,
      );
    }

    return adminRoles;
  }

  async getAllRoles() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany();
  }
}
