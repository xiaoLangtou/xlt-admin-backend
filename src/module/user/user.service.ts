import { User } from '@/module/user/entities/user.entity';
import { UpdateUserInfoDto } from '@/module/user/dto/update-info.dto';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDto } from '@/module/user/dto/create-user.dto';
import { Result } from '@/common/utils/result';
import { CREATE_TIME_FORMAT, QUERY_ERROR_CODE, UPDATE_TIME_FORMAT } from '@/common/constant';
import { getPagination, md5 } from '@/common/utils/utils';
import { Dept } from '@/module/dept/entities/dept.entity';
import { Role } from '@/module/role/entities/role.entity';
import { Post } from '@/module/post/entities/post.entity';
import { QueryUserDto, QueryUserWithRolesDto, RemoveUserRoleDto } from '@/module/user/dto/query-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  @Inject(ConfigService)
  private configService: ConfigService;

  /**
   * 创建用户
   * @param createUserDto
   * @param username
   */
  async create(createUserDto: CreateUserDto, username: string) {
    const user = new User();
    user.password = md5(md5('admin123456'));
    user.createBy = username;
    return await this.assignCommonUserProperties(user, createUserDto, username);
  }

  /**
   * 更新用户信息
   * @param userDto
   * @param username
   */
  async updated(userDto: UpdateUserInfoDto, username: string) {
    const user = await this.userRepo.findOne({ where: { id: userDto.id } });

    if (!user) {
      return Result.fail(QUERY_ERROR_CODE, '用户不存在');
    }

    return await this.assignCommonUserProperties(user, userDto, username, '修改用户成功', '修改用户失败');
  }

  /**
   * 分配用户公共属性
   * @param user
   * @param userDto
   * @param username
   * @param successMessage
   * @param errorMessage
   */
  async assignCommonUserProperties(
    user: User,
    userDto: CreateUserDto | UpdateUserInfoDto,
    username: string,
    successMessage = '创建用户成功',
    errorMessage = '创建用户失败',
  ) {
    user.username = userDto.username;
    user.nickname = userDto.nickname;
    user.email = userDto.email;
    user.name = userDto.name || '';
    user.phoneNumber = userDto.phone;
    user.jobNumber = userDto.jobNumber;
    user.sex = userDto.sex;
    user.updateBy = username;
    user.remark = userDto.remark;
    user.dept = this.createDeptEntity(userDto.deptId);
    const _roles = this.createRoleEntities(userDto.roles);
    const _posts = this.createPostEntities(userDto.post);
    if (_roles.length > 0) {
      user.roles = _roles;
    }
    if (_posts.length > 0) {
      user.posts = _posts;
    }

    try {
      await this.userRepo.save(user);
      return Result.ok(successMessage);
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, errorMessage);
    }
  }

  /**
   * 根据id获取用户
   * @param id
   */
  async getUserById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id, delFlag: '0' },
      select: ['id', 'username', 'nickname', 'email', 'name', 'jobNumber', 'phoneNumber', 'sex', 'dept', 'roles', 'posts', 'remark'],
      relations: ['dept', 'posts', 'roles'],
    });
    return Result.ok(user);
  }

  /**
   * 根据id删除用户
   * @param id
   * @param username
   */
  async deleteUserById(id: number, username) {
    console.log(id);
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      return Result.fail(QUERY_ERROR_CODE, '用户不存在');
    }
    user.delFlag = '1';
    user.deleteTime = new Date();
    user.deleteBy = username;
    await this.userRepo.save(user);
    return Result.ok('删除用户成功');
  }

  /**
   * 获取用户列表
   * @param query
   */
  async getUserList(query: QueryUserDto) {
    const { current = 1, size = 10, ...otherParams } = query;
    const queryBuilder = await this.userRepo.createQueryBuilder('user');
    queryBuilder.innerJoinAndSelect('user.dept', 'dept');
    queryBuilder.where('user.delFlag = :delFlag', { delFlag: '0' }).andWhere('user.username != :username', { username: 'admin' });

    queryBuilder.select([
      'user.id as id',
      'user.username as username',
      'user.nickname as nickname',
      'user.email as email',
      'user.name as name',
      'user.job_number as jobNumber',
      'user.phone_number as phone',
      UPDATE_TIME_FORMAT('user'),
      'user.is_frozen as status',
      'dept.dept_name as deptName',
      'user.deptId as deptId',
    ]);
    if (otherParams.deptId) {
      queryBuilder.andWhere('user.deptId = :deptId and user.deptId is not null ', {
        deptId: otherParams.deptId,
      });
    }
    if (otherParams.username) {
      queryBuilder.andWhere('user.username like :username', {
        username: `%${otherParams.username}%`,
      });
    }

    if (otherParams.nickname) {
      queryBuilder.andWhere('user.nickname like :nickname', {
        nickname: `%${otherParams.nickname}%`,
      });
    }

    if (otherParams.email) {
      queryBuilder.andWhere('user.email like :email', {
        email: `%${otherParams.email}%`,
      });
    }

    if (otherParams.phone) {
      queryBuilder.andWhere('user.phoneNumber like :phone', {
        phone: `%${otherParams.phone}%`,
      });
    }

    if (otherParams.beginTime && otherParams.endTime) {
      queryBuilder.andWhere('user.createTime between :beginTime and :endTime', {
        beginTime: otherParams.beginTime,
        endTime: otherParams.endTime,
      });
    }

    if (otherParams.status) {
      queryBuilder.andWhere('user.is_frozen = :status', {
        status: otherParams.status,
      });
    }
    try {
      queryBuilder.groupBy('user.id');
      const count = await queryBuilder.getCount();

      const pager = getPagination(count, +current, +size);

      console.log(pager);

      const list = await queryBuilder.offset(pager.startRow).limit(pager.pageInfo.pageSize).orderBy('user.create_time', 'DESC').getRawMany();

      console.log(queryBuilder.getSql());

      return Result.list<User>(list, pager.pageInfo);
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '查询用户列表失败');
    }
  }

  /**
   * 根据角色id获取当前角色下的用户列表
   * @param {QueryUserWithRolesDto} query
   * @param {number} query.current
   * @param {number} query.size
   * @param {string} query.username
   * @param {string} query.nickname
   * @param {string} query.email
   * @param {string} query.phone
   * @param {string} query.status
   * @param {number} query.roleId
   * @returns {Promise<Result>}
   */
  async getUserListByRoleId(query: QueryUserWithRolesDto) {
    const { current = 1, size = 10, roleId, ...otherParams } = query;
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .innerJoinAndSelect('user_roles', 'ur', 'ur.user_id = user.id')
      .where('ur.role_id = :roleId', { roleId })
      .andWhere('user.delFlag = :delFlag', { delFlag: '0' })

      .select([
        'user.id as id',
        'user.username as username',
        'user.nickname as nickname',
        'user.email as email',
        'user.phone_number as phone ',
        'user.is_frozen as status',
        CREATE_TIME_FORMAT('user'),
      ]);

    this.applyFilters(queryBuilder, otherParams);
    return this.executeQuery(queryBuilder, current, size);
  }

  /**
   * 移除用户角色
   * @param query
   */
  async removeUserRole(query: RemoveUserRoleDto) {
    const { userId, roleId } = query;
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      return Result.fail(QUERY_ERROR_CODE, '用户不存在');
    }
    user.roles = user.roles.filter((role) => role.id !== roleId);
    try {
      await this.userRepo.save(user);
      return Result.ok('移除用户角色成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '移除用户角色失败');
    }
  }

  private async executeQuery(queryBuilder: SelectQueryBuilder<User>, current: number, size: number) {
    try {
      const count = await queryBuilder.getCount();
      const pager = getPagination(count, current, size);
      queryBuilder.skip(pager.startRow).take(size).orderBy('user.create_time', 'DESC');

      const list = await queryBuilder.getRawMany();
      return Result.list<User>(list, pager.pageInfo);
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '查询用户列表失败');
    }
  }

  /**
   * 查询用户列表
   * @param queryBuilder
   * @param params
   * @private
   */
  private applyFilters(queryBuilder: SelectQueryBuilder<User>, params: any) {
    if (params.username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${params.username}%`,
      });
    }

    if (params.nickname) {
      queryBuilder.andWhere('user.nickname LIKE :nickname', {
        nickname: `%${params.nickname}%`,
      });
    }

    if (params.email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${params.email}%`,
      });
    }

    if (params.phone) {
      queryBuilder.andWhere('user.phone_number LIKE :phone', {
        phone: `%${params.phone}%`,
      });
    }

    if (params.status) {
      queryBuilder.andWhere('user.is_frozen = :status', {
        status: params.status,
      });
    }
  }

  /**
   * 修改用户状态
   * @param id
   * @param status
   * @param username
   */
  async changeStatus(id: number, status: string, username: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      return Result.fail(QUERY_ERROR_CODE, '用户不存在');
    }
    user.isFrozen = status;
    user.updateBy = username;
    try {
      await this.userRepo.save(user);
      return Result.ok('修改用户状态成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '修改用户状态失败');
    }
  }

  /**
   * 重置密码
   * @param {number[]} ids
   * @param {string} username 用户名
   */
  async resetPassword(ids: number[], username: string) {
    const users = await this.userRepo.find({ where: { id: In(ids) } });
    if (users.length <= 0) {
      return Result.fail(QUERY_ERROR_CODE, '用户不存在');
    }
    const password = md5(md5(this.configService.get('application.default_password')));
    users.forEach((user) => {
      user.password = password;
      user.updateBy = username;
    });

    try {
      await this.userRepo.save(users);
      return Result.ok('重置密码成功,密码为默认密码:admin123456');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '重置密码失败');
    }
  }

  /**
   * 批量删除用户
   * @param {number[]} ids 用户id集合
   * @param {string} username 用户名
   */
  async batchDelete(ids: number[], username: string) {
    const users = await this.userRepo.find({ where: { id: In(ids) } });
    if (users.length <= 0) {
      return Result.fail(QUERY_ERROR_CODE, '用户不存在');
    }
    users.forEach((user) => {
      user.delFlag = '1';
      user.deleteBy = username;
      user.deleteTime = new Date();
    });
    try {
      await this.userRepo.save(users);
      return Result.ok('删除用户成功');
    } catch (e) {
      return Result.fail(QUERY_ERROR_CODE, '删除用户失败');
    }
  }

  /**
   * 创建部门实体
   * @param deptId
   * @private
   */
  private createDeptEntity(deptId: number): Dept {
    const dept = new Dept();
    dept.id = deptId;
    return dept;
  }

  /**
   * 创建角色实体
   * @param roles
   * @private
   */
  private createRoleEntities(roles: number[]): Role[] {
    return roles
      ? roles.map((id) => {
          const role = new Role();
          role.id = id;
          return role;
        })
      : [];
  }

  /**
   * 创建岗位实体
   * @param posts
   * @private
   */
  private createPostEntities(posts: number[]): Post[] {
    return posts
      ? posts.map((id) => {
          const post = new Post();
          post.id = id;
          return post;
        })
      : [];
  }
}
