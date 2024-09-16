import { Controller, Get, Query } from '@nestjs/common';
import { AdminsService } from '@apps/rest/admin/services/admins.servicces';
import { SearchParamsDto } from '@apps/rest/admin/dto/search-params.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('admins')
@ApiTags('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @ApiOperation({ summary: '관리자 리스트 ' })
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
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'departmentId', required: false, type: String })
  async getAllAdmins(@Query() params: SearchParamsDto) {
    return await this.adminsService.findAll(params);
  }

  @Get('departments')
  @ApiOperation({ summary: '전체 계층형 부서 리스트 조회' })
  async getDepartments() {
    return await this.adminsService.getDepartments();
  }
}
