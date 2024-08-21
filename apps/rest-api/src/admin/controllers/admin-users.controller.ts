import {Controller, Get, Query, ValidationPipe} from '@nestjs/common';
import {AdminSearchDto, PaginatedAdminResponseDto} from "@apps/rest/admin/dto/admion-search.dto";
import {AdminUsersService} from "@apps/rest/admin/services/admin-users.service";

@Controller('admin')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}


  @Get()
  @Roles('ADMIN_LIST_VIEW')
  async getAdminList(
      @Query(new ValidationPipe({ transform: true })) searchDto: AdminSearchDto
  ): Promise<PaginatedAdminResponseDto> {
    return this.adminUsersService.findAll(searchDto);
  }
}
