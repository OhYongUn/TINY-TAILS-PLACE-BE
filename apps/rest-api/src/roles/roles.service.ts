import {Injectable} from "@nestjs/common";
import {PrismaService} from "@app/common/prisma/prisma.service";
import {CreateRoleDto} from "@apps/rest/roles/dto/create-role.dto";
import {UpdateRoleDto} from "@apps/rest/roles/dto/update-role.dto";
import {CreatePermissionDto} from "@apps/rest/roles/dto/create-permission.dto";
import {CreateAdminRoleDto} from "@apps/rest/roles/dto/create-admin-role.dto";
import {UpdateAdminRoleDto} from "@apps/rest/roles/dto/update-admin-role.dto";
import {CreateRolePermissionDto} from "@apps/rest/roles/dto/create-role-permission.dto";
import {UpdateRolePermissionDto} from "@apps/rest/roles/dto/update-role-permission.dto";
import {UpdatePermissionDto} from "@apps/rest/roles/dto/update-permission.dto";

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {}

    // Role operations
    async createRole(createRoleDto: CreateRoleDto) {
        return this.prisma.role.create({
            data: createRoleDto,
        });
    }

    async findAllRoles() {
        return this.prisma.role.findMany({
            include: {
                adminRoles: true,
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }

    async findOneRole(id: number) {
        return this.prisma.role.findUnique({
            where: { id },
            include: {
                adminRoles: true,
                rolePermissions: {
                    include: {
                        permission: true,
                    },
                },
            },
        });
    }

    async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
        return this.prisma.role.update({
            where: { id },
            data: updateRoleDto,
        });
    }

    async removeRole(id: number) {
        return this.prisma.role.delete({
            where: { id },
        });
    }

    // Permission operations
    async createPermission(createPermissionDto: CreatePermissionDto) {
        return this.prisma.permission.create({
            data: createPermissionDto,
        });
    }

    async findAllPermissions() {
        return this.prisma.permission.findMany({
            include: {
                rolePermissions: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async findOnePermission(id: number) {
        return this.prisma.permission.findUnique({
            where: { id },
            include: {
                rolePermissions: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }

    async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
        return this.prisma.permission.update({
            where: { id },
            data: updatePermissionDto,
        });
    }

    async removePermission(id: number) {
        return this.prisma.permission.delete({
            where: { id },
        });
    }

    // AdminRole operations
    async createAdminRole(createAdminRoleDto: CreateAdminRoleDto) {
        return this.prisma.adminRole.create({
            data: createAdminRoleDto,
        });
    }

    async findAllAdminRoles() {
        return this.prisma.adminRole.findMany({
            include: {
                admin: true,
                role: true,
            },
        });
    }

    async findOneAdminRole(id: number) {
        return this.prisma.adminRole.findUnique({
            where: { id },
            include: {
                admin: true,
                role: true,
            },
        });
    }

    async updateAdminRole(id: number, updateAdminRoleDto: UpdateAdminRoleDto) {
        return this.prisma.adminRole.update({
            where: { id },
            data: updateAdminRoleDto,
        });
    }

    async removeAdminRole(id: number) {
        return this.prisma.adminRole.delete({
            where: { id },
        });
    }

    // RolePermission operations
    async createRolePermission(createRolePermissionDto: CreateRolePermissionDto) {
        return this.prisma.rolePermission.create({
            data: createRolePermissionDto,
        });
    }

    async findAllRolePermissions() {
        return this.prisma.rolePermission.findMany({
            include: {
                role: true,
                permission: true,
            },
        });
    }

    async findOneRolePermission(id: number) {
        return this.prisma.rolePermission.findUnique({
            where: { id },
            include: {
                role: true,
                permission: true,
            },
        });
    }

    async updateRolePermission(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
        return this.prisma.rolePermission.update({
            where: { id },
            data: updateRolePermissionDto,
        });
    }

    async removeRolePermission(id: number) {
        return this.prisma.rolePermission.delete({
            where: { id },
        });
    }
}
