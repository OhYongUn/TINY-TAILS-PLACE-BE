// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(payload: any): Promise<any> {
    return await this.usersService.findOneById(payload.userId);
  }
}
