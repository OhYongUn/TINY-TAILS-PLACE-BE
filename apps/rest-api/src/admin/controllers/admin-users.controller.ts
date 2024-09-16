import { Controller, Get, Query } from '@nestjs/common';
import { AdminUsersService } from '@apps/rest/admin/services/admin-users.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchParamsDto } from '@apps/rest/admin/dto/search-params.dto';

@ApiTags('admin-users')
@Controller('admin-users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get users list' })
  @ApiQuery({
    name: 'searchOption',
    required: false,
    enum: ['name', 'email', 'phone'],
  })
  @ApiQuery({ name: 'searchQuery', required: false, type: String })
  @ApiQuery({
    name: 'sortOption',
    required: false,
    enum: ['createdAt_desc', 'createdAt_asc'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getUsers(@Query() params: SearchParamsDto) {
    return await this.adminUsersService.getUsers(params);
  }
}
