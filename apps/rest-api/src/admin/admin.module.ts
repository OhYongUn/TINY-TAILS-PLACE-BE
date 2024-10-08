import { Module } from '@nestjs/common';
import { AdminUsersController } from '@apps/rest/admin/controllers/admin-users.controller';
import { AdminBookingsController } from '@apps/rest/admin/controllers/admin-bookings.controller';
import { AdminRolesController } from '@apps/rest/admin/controllers/admin-roles.controller';
import { AdminRolesService } from '@apps/rest/admin/services/admin-roles.service';
import { AdminUsersService } from '@apps/rest/admin/services/admin-users.service';
import { AdminBookingsService } from '@apps/rest/admin/services/admin-bookings.service';
import { AdminPaymentsService } from '@apps/rest/admin/services/admin-payments.service';
import { AdminPaymentsController } from '@apps/rest/admin/controllers/admin-payments.controller';
import { AdminsController } from '@apps/rest/admin/controllers/admins.controller';
import { AdminsService } from '@apps/rest/admin/services/admins.servicces';

@Module({
  controllers: [
    AdminUsersController,
    AdminBookingsController,
    AdminRolesController,
    AdminPaymentsController,
    AdminsController,
  ],
  providers: [
    AdminUsersService,
    AdminRolesService,
    AdminBookingsService,
    AdminPaymentsService,
    AdminsService,
  ],
  exports: [AdminRolesService, AdminUsersService],
})
export class AdminModule {}
