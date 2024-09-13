import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { ChangeRoleDto, UpdateRoleDto } from './dto/update-role.dto';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../menu/entities/menu.entity';
import { Result } from '@/common/utils/result';
import { getPagination, Uniq } from '@/common/utils/utils';
import { QueryRoleDto } from './dto/query-role.dto';
import { CREATE_TIME_FORMAT, QUERY_ERROR_CODE } from '@/common/constant';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleResp: Repository<Role>;

  /**
   * @description 创建或更新角色
   * @param role 角色实例
   * @param roleDto 角色参数
   * @param username 用户名
   */
  private async saveRole(
    role: Role,
    roleDto: CreateRoleDto | UpdateRoleDto,
    username: string,
  ) {
    const connection = this.roleResp.manager.connection;

    return await connection.transaction(async (transactionEntityManager) => {
      role.name = roleDto.roleName;
      role.roleCode = roleDto.roleCode;
      role.description = roleDto.description;
      role.isEnable = roleDto.isEnable;
      role.sortOrder = roleDto.sortOrder;
      role.updateBy = username;

      if (roleDto.menus && roleDto.menus.length > 0) {
        role.menus = roleDto.menus.map((menuId: number) => {
          const menu = new Menu();
          menu.id = menuId;
          return menu;
        });
      } else {
        role.menus = [];
      }

      const res = await transactionEntityManager.save(role);

      if (!res) {
        return Result.fail(
          role.id ? QUERY_ERROR_CODE : QUERY_ERROR_CODE,
          role.id ? '更新失败' : '创建失败',
        );
      }
      return Result.ok(role.id ? '更新成功' : '创建成功');
    });
  }

  /**
   * @description 创建角色
   * @param createRoleDto 创建角色参数
   * @param username 用户名
   */
  async createRole(createRoleDto: CreateRoleDto, username: string) {
    const role = new Role();
    role.createBy = username;
    return this.saveRole(role, createRoleDto, username);
  }

  /**
   * @description 更新角色
   * @param id 角色id
   * @param updateRoleDto 更新角色参数
   * @param username 用户名
   */
  async updateRole(id: number, updateRoleDto: UpdateRoleDto, username: string) {
    const role = await this.roleResp.findOne({
      where: { id, delFlag: '0' },
    });

    if (!role) {
      return Result.fail(20002, '角色不存在');
    }
    return this.saveRole(role, updateRoleDto, username);
  }

  /**
   * @description 删除角色
   * @param id 角色id
   * @param username 用户名
   */

  async deleteRole(id: number, username: string) {
    const role = await this.roleResp.findOne({
      where: { id, delFlag: '0' },
    });

    if (!role) {
      return Result.fail(20002, '角色不存在');
    }

    // todo 如果角色下有用户，不允许删除，提示角色下有用户，不允许删除

    role.delFlag = '1';
    role.updateBy = username;

    try {
      await this.roleResp.save(role);
      return Result.ok('删除成功');
    } catch (e) {
      return Result.fail(20004, '删除失败');
    }
  }

  /**
   * @description 获取角色列表
   * @param query 查询参数
   * @param query.roleName 角色名称
   * @param query.roleCode 角色标识
   * @param query.isEnable 是否启用
   * @param query.current 当前页
   * @param query.size 每页条数
   * @param query.startTime 开始时间
   * @param query.endTime 结束时间
   * @returns
   */
  async getRoleList({
    roleName,
    roleCode,
    isEnable,
    current = 1,
    size = 10,
    startTime,
    endTime,
  }: QueryRoleDto) {
    const queryBuilder = this.roleResp.createQueryBuilder('role');
    queryBuilder.select([
      'role.id as id',
      'role.name as roleName',
      'role.role_code as roleCode',
      'role.is_enable as isEnable',
      'role.sort_order as sortOrder',
      CREATE_TIME_FORMAT('role'),
    ]);

    if (roleName) {
      queryBuilder.where('role.name like :roleName', {
        roleName: `%${roleName}%`,
      });
    }

    if (roleCode) {
      queryBuilder.andWhere('role.roleCode like :roleCode', {
        roleCode: `%${roleCode}%`,
      });
    }

    if (isEnable) {
      queryBuilder.andWhere('role.isEnable = :isEnable', { isEnable });
    }

    if (startTime) {
      queryBuilder.andWhere('role.createTime >= :startTime', { startTime });
    }

    if (endTime) {
      queryBuilder.andWhere('role.createTime <= :endTime', { endTime });
    }

    queryBuilder.andWhere('role.delFlag = :delFlag', { delFlag: '0' });
    queryBuilder.andWhere("role.roleCode != 'SUPER_ADMIN'");

    const total = await queryBuilder.getCount();

    const pager = getPagination(total, current, size);

    const list = await queryBuilder
      .skip(pager.startRow)
      .take(pager.pageInfo.pageSize)
      .orderBy('role.sortOrder', 'DESC')
      .getRawMany();

    return Result.ok({
      records: list,
      pager: pager.pageInfo,
    });
  }

  /**
   * @description 获取角色详情
   * @param id 角色id
   */
  async getRoleDetail(id: number) {
    const role = await this.roleResp.findOne({
      where: { id, delFlag: '0' },
      relations: ['menus'],
    });

    if (!role) {
      return Result.fail(20002, '角色不存在');
    }
    return Result.ok({ ...role, menus: role.menus.map((menu) => menu.id) });
  }

  /**
   * @description 设置角色菜单
   * @param id  角色id
   * @param menuIds  菜单id集合
   * @returns
   */
  async setRoleMenus(id: number, menuIds: number[]) {
    const role = await this.roleResp.findOne({
      where: { id, delFlag: '0' },
    });

    if (!role) {
      return Result.fail(20002, '角色不存在');
    }

    if (!menuIds || menuIds.length === 0) {
      role.menus = [];
    } else {
      const menus = menuIds.map((menuId) => {
        const menu = new Menu();
        menu.id = menuId;
        return menu;
      });
      role.menus = menus;
    }

    try {
      await this.roleResp.save(role);
      return Result.ok('设置成功');
    } catch (e) {
      return Result.fail(20003, '设置失败');
    }
  }

  /**
   * @description 获取角色菜单
   * @param id 角色id
   */
  async getRoleMenus(id: number) {
    const role = await this.roleResp.findOne({
      where: { id, delFlag: '0' },
      relations: ['menus'],
    });
    if (!role) {
      return Result.fail(20002, '角色不存在');
    }
    return Result.ok(role.menus.map((menu) => menu.id));
  }

  /**
   * 根据角色ids获取菜单
   */
  async getMenusByRoleIds(roleIds: number[]) {
    const roles = await this.roleResp.find({
      where: {
        id: In(roleIds),
      },
      relations: ['menus'],
    });

    const menus = roles.reduce((acc, cur) => {
      acc.push(...cur.menus);
      return acc;
    }, []);

    return Uniq(menus.map((menu) => menu.id));
  }

  /**
   *
   * @description 设置角色状态
   * @param {number} roleId 角色id
   * @param {number} isEnable 是否启用
   * @param {string} username
   * @returns
   */
  async changeRoleStatus(
    { roleId, isEnable }: ChangeRoleDto,
    username: string,
  ) {
    const role = await this.roleResp.findOne({
      where: { id: roleId, delFlag: '0' },
    });

    if (!role) {
      return Result.fail(20002, '角色不存在');
    }

    role.isEnable = isEnable;
    role.updateBy = username;

    try {
      await this.roleResp.save(role);
      return Result.ok('设置成功');
    } catch (e) {
      return Result.fail(20003, '设置失败');
    }
  }

  /**
   * 批量给角色添加用户
   * @param {number} roleId 角色id
   * @param {number[]} userIds 用户id集合
   * @returns
   */
  async addUsersToRole(roleId: number, userIds: number[]) {
    if (!userIds || userIds.length === 0) {
      return Result.fail(QUERY_ERROR_CODE, '用户id不能为空');
    }
    const role = await this.roleResp.findOne({
      where: { id: roleId, delFlag: '0' },
    });

    if (!role) {
      return Result.fail(QUERY_ERROR_CODE, '角色不存在');
    }

    try {
      await this.roleResp
        .createQueryBuilder()
        .relation(Role, 'users')
        .of(role)
        .add(userIds);
      return Result.ok('添加成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '添加失败');
    }
  }

  /**
   * 批量移除角色下的用户
   * @param {number} roleId 角色id
   * @param {number[]} userIds 用户id集合
   */
  async removeUsersFromRole(roleId: number, userIds: number[]) {
    if (!userIds || userIds.length === 0) {
      return Result.fail(QUERY_ERROR_CODE, '用户id不能为空');
    }
    const role = await this.roleResp.findOne({
      where: { id: roleId, delFlag: '0' },
    });

    if (!role) {
      return Result.fail(QUERY_ERROR_CODE, '角色不存在');
    }

    try {
      await this.roleResp
        .createQueryBuilder()
        .relation(Role, 'users')
        .of(role)
        .remove(userIds);
      return Result.ok('移除成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '移除失败');
    }
  }

  /**
   * 根据角色id获取权限
   * @param roleId 角色id
   * @returns
   */
  async getRolePermissions(roleId: number[]) {
    console.log(roleId, 'roleId');
    const roles = await this.roleResp.find({
      where: {
        id: In(roleId),
      },
      relations: ['menus'],
    });
    const menus = roles.reduce((acc, cur) => {
      acc.push(...cur.menus);
      return acc;
    }, []);
    return Uniq(menus.map((menu) => menu.permission)).filter((item) => item);
  }
}
