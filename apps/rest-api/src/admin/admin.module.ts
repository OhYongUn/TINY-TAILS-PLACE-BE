import { Module } from '@nestjs/common';
import { AdminUsersController } from '@apps/rest/admin/controllers/admin-users.controller';
import { AdminBookingsController } from '@apps/rest/admin/controllers/admin-bookings.controller';
import { AdminRolesController } from '@apps/rest/admin/controllers/admin-roles.controller';
import { AdminRolesService } from '@apps/rest/admin/services/admin-roles.service';
import { AdminUsersService } from '@apps/rest/admin/services/admin-users.service';
import { AdminBookingsService } from '@apps/rest/admin/services/admin-bookings.service';

@Module({
  controllers: [
    AdminUsersController,
    AdminBookingsController,
    AdminRolesController,
  ],
  providers: [AdminUsersService, AdminRolesService, AdminBookingsService],
  exports: [AdminRolesService, AdminUsersService],
})
export class AdminModule {}
