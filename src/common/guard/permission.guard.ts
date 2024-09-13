import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // 获取当前请求的用户信息
    if (!request.user) {
      return true;
    }
    const userPermissions = request.user.permissions;

    // 获取当前请求的权限 metadata
    const requirePermissions = this.reflector.getAllAndOverride<string[]>(
      'requirePermissions',
      [context.getHandler(), context.getClass()],
    );
    console.log(userPermissions, requirePermissions, 'userPermissions');
    if (!requirePermissions) {
      return true;
    }

    // 判断当前用户是否有权限
    if (userPermissions.includes('*:*:*')) {
      return true;
    }

    const hasPermission = requirePermissions.every((permission) =>
      userPermissions.some((item) => item === permission),
    );

    if (!hasPermission) {
      throw new UnauthorizedException('用户无权限');
    }

    return true;
  }
}
