import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('requireLogin', true);
export const RequirePermissions = (...permissions: string[]) => SetMetadata('requirePermissions', permissions);

export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  if (!request.user) {
    return null;
  }

  return data ? request.user[data] : request.user;
});

export const RequireRoles = (role: string) => SetMetadata('requireRoles', role);
