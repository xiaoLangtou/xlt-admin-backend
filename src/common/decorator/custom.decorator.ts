import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

// 是否必须登录
export const RequireLogin = () => SetMetadata('requireLogin', true);

// 权限
export const RequirePermissions = (...permissions: string[]) => SetMetadata('requirePermissions', permissions);

// 获取用户信息
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  if (!request.user) {
    return null;
  }

  return data ? request.user[data] : request.user;
});

export const RequireRoles = (role: string) => SetMetadata('requireRoles', role);
