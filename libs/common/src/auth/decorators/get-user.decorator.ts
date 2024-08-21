import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Admin, User } from '@prisma/client';

export type AuthenticatedUser = (User | Admin) & { isAdmin: boolean };

export const GetAuthenticatedUser  = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;

      return {
        ...user,
      };
    },
);