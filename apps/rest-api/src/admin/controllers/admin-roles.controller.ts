import { Controller } from '@nestjs/common';
import { AdminRolesService } from '../services/admin-roles.service';

@Controller('roles')
export class AdminRolesController {
  constructor(private readonly adminRolesService: AdminRolesService) {}
}
