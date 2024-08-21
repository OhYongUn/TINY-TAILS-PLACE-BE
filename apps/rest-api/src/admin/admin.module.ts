import { Module } from '@nestjs/common';
import { AdminUsersService } from './services/admin-users.service';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminBookingsController } from './controllers/admin-bookings.controller';
import {AdminRolesController} from "@apps/rest/admin/controllers/admin-roles.controller";
import {AdminRolesService} from "@apps/rest/admin/services/admin-roles.service";
import {APP_GUARD} from "@nestjs/core";
import {RolesGuard} from "@apps/rest/admin/guards/roles.guard";

@Module({
  controllers: [AdminUsersController, AdminBookingsController,AdminRolesController],
  providers: [AdminUsersService,AdminRolesService, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },],
  exports:[AdminRolesService]
})
export class AdminModule {}
