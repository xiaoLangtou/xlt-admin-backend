import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CasbinService } from '@/module/casbin/casbin.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(CasbinService)
  private readonly casbinService: CasbinService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // 获取当前请求的用户信息
    if (!request.user) {
      return true;
    }
    const { user } = request;
    if (!user.roles || user.roles.length <= 0) {
      throw new UnauthorizedException('当前用户未设置角色，请联系管理员！');
    }

    // 获取请求路径和请求方法
    const { path, method } = request;
    const hasPermission = await this.hasRolePermission(user.roles, [path, method]);

    // 把忽略的权限给用户

    if (!hasPermission) {
      throw new UnauthorizedException('用户权限不足');
    }

    return true;
  }

  async hasRolePermission(roles: any, permissions: string[]) {
    const results = await Promise.all(
      roles.map((role: any) => this.casbinService.hasPermissionForUser(role.code, permissions)),
    );
    console.log(results)
    // 只要有一个角色有权限，就返回 true
    return results.some((result: any) => result);
  }
}
