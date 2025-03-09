import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';

// 是否必须登录
export const RequireLogin = () => SetMetadata('requireLogin', true);


// 获取用户信息
export const UserInfo = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  if (!request.user) {
    return null;
  }

  return data ? request.user[data] : request.user;
});

