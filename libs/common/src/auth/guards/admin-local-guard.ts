import {AuthGuard} from "@nestjs/passport";

export class AdminLocalGuard  extends AuthGuard('admin-local') {}