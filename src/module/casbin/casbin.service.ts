import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';

@Injectable()
export class CasbinService {
  constructor(@Inject('CASBIN_ENFORCER') private readonly enforcer: Enforcer) {}

  /**
   * 添加单个用户角色
   * @param {string} username  用户名
   * @param {string} role 角色
   */
  async addRoleForUser(username: string, role: string): Promise<boolean> {
    return await this.enforcer.addRoleForUser(username, role);
  }

  /**
   * 添加多个用户角色
   * @param {string} username  用户名
   * @param {string[]} roles 角色
   */
  async addRolesForUser(username: string, roles: string[]): Promise<boolean> {
    roles.map(async (role) => {
      // 先判断是否存在
      const hasRole = await this.enforcer.hasRoleForUser(username, role);
      if (!hasRole) {
        await this.enforcer.addRoleForUser(username, role);
      }
    });
    return true;
  }

  /**
   * 判断用户是否拥有某个角色
   * @param {string} username  用户名
   * @param {string} role 角色
   */
  async hasRoleForUser(username: string, role: string): Promise<boolean> {
    return await this.enforcer.hasRoleForUser(username, role);
  }

  /**
   * 获取用户拥有的角色
   * @param {string} username  用户名
   */
  async getRolesForUser(username: string): Promise<string[]> {
    return await this.enforcer.getRolesForUser(username);
  }

  /**
   * 获取某个角色下的所有用户
   * @param {string} role 角色
   */
  async getUsersForRole(role: string): Promise<string[]> {
    return await this.enforcer.getUsersForRole(role);
  }

  /**
   * 删除用户的某个角色
   * @param {string} username  用户名
   * @param {string} role 角色
   */
  async deleteRoleForUser(username: string, role: string): Promise<boolean> {
    return await this.enforcer.deleteRoleForUser(username, role);
  }

  /**
   * 删除用户的所有角色
   * @param {string} username  用户名
   */
  async deleteRolesForUser(username: string): Promise<boolean> {
    return await this.enforcer.deleteRolesForUser(username);
  }

  /**
   * 为用户或角色添加一条权限
   * @param {string} username  用户名
   * @param {string[]} permissions 权限
   */
  async addPermissionForUser(username: string, permissions: string[]): Promise<boolean> {
    return await this.enforcer.addPermissionForUser(username, ...permissions);
  }

  /**
   * 为用户或角色添加多条权限
   * @param {string} username  用户名
   * @param {string[][]} permissions 权限
   */
  async addPermissionsForUser(username: string, permissions: string[][]): Promise<boolean> {
    permissions.map(async (permission) => {
      if (permission.length === 0) {
        return false;
      }
      await this.enforcer.addPermissionForUser(username, ...permission);
    });
    return true;
  }

  /**
   * 删除用户或角色的某个权限
   * @param {string} username  用户名
   * @param {string[]} permissions 权限
   */
  async deletePermissionForUser(username: string, permissions: string[]): Promise<boolean> {
    return await this.enforcer.deletePermissionForUser(username, ...permissions);
  }

  /**
   * 删除用户或角色的多个权限
   * @param {string} username  用户名
   * @param {string[][]} permissions 权限
   */
  async deletePermissionsForUser(username: string, permissions: string[][]): Promise<boolean> {
    permissions.map(async (permission) => {
      if (permission.length === 0) {
        return false;
      }
      await this.enforcer.deletePermissionForUser(username, ...permission);
    });
    return true;
  }

  /**
   * 获取用户或角色的所有权限
   * @param {string} username  用户名
   */
  async getPermissionsForUser(username: string): Promise<string[][]> {
    return await this.enforcer.getPermissionsForUser(username);
  }

  /**
   * 校验用户或角色是否拥有某个权限
   */
  async hasPermissionForUser(username: string, permission: string[]): Promise<boolean> {
    return await this.enforcer.hasPermissionForUser(username, ...permission);
  }
}
