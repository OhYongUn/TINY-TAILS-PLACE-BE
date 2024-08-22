import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdminRolesService } from '../services/admin-roles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from '@apps/rest/admin/dto/roles/create-role.dto';
import { CreatePermissionDto } from '@apps/rest/admin/dto/roles/create-permission.dto';
import { AssignRoleDto } from '@apps/rest/admin/dto/roles/assign-role.dto';

@ApiTags('admin-roles')
@Controller('admin-roles')
export class AdminRolesController {
  constructor(private readonly adminRolesService: AdminRolesService) {}

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Return all roles.',
  })
  async getAllRoles() {
    return this.adminRolesService.getAllRoles();
  }
  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Return all permissions.',
  })
  async getAllPermissions() {
    return this.adminRolesService.getAllPermissions();
  }
  @Post('roles')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.adminRolesService.createRole(createRoleDto);
  }

  @Post('permissions')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({
    status: 201,
    description: 'The permission has been successfully created.',
  })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.adminRolesService.createPermission(createPermissionDto);
  }

  @Post('assign-role')
  @ApiOperation({ summary: 'Assign a role to an admin' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully assigned to the admin.',
  })
  async assignRoleToAdmin(@Body() assignRoleDto: AssignRoleDto) {
    return await this.adminRolesService.assignRoleToAdmin(assignRoleDto);
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get a role with its permissions' })
  @ApiResponse({
    status: 200,
    description: 'Return the role with its permissions.',
  })
  async getRoleWithPermissions(@Param('id') id: string) {
    return await this.adminRolesService.getRoleWithPermissions(+id);
  }

  @Get('admin/:id/roles')
  @ApiOperation({ summary: 'Get all roles assigned to an admin' })
  @ApiResponse({
    status: 200,
    description: 'Return all roles assigned to the admin.',
  })
  async getAdminRoles(@Param('id') id: string) {
    return await this.adminRolesService.getAdminRoles(id);
  }
}
