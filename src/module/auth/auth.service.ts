import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/create-user.dto';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { User } from '@/module/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '@/module/redis/redis.service';
import { getPagination, md5 } from '@/common/utils/utils';
import { LoginUserDto } from '@/module/user/dto/login-user.dto';
import { CACHE_KEY, CAPTCHA_TYPE, USER_IS_ADMIN, USER_IS_FROZEN } from '@/common/enums';
import { LoginUserVo } from '@/module/user/vo/login-user.vo';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@/module/role/entities/role.entity';
import { EmailService } from '@/module/email/email.service';
import { Result } from '@/common/utils/result';
import { RoleService } from '@/module/role/role.service';
import { LoginLogService } from '@/module/monitor/login-log/login-log.service';
import { REDIS_LOGIN_USER_EXPIRE_TIME } from '@/common/constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * redis服务
   * @private
   */
  @Inject(RedisService)
  private redisService: RedisService;

  /**
   * jwt服务
   * @private
   */
  @Inject(JwtService)
  private jwtService: JwtService;

  /**
   * 配置服务
   * @private
   */
  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(RoleService)
  private roleService: RoleService;

  /**
   * 邮件服务
   * @private
   */
  @Inject(EmailService)
  private emailService: EmailService;

  /**
   * 用户仓库
   * @private
   */
  @InjectRepository(User)
  private userRepository: Repository<User>;

  /**
   * 角色仓库
   * @private
   */
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @Inject(LoginLogService)
  private loginLogService: LoginLogService;

  /**
   * 注册
   * @param userDto
   */
  async register(userDto: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha:${userDto.email}`);
    if (!captcha) {
      throw new HttpException('验证码已过期', HttpStatus.BAD_REQUEST);
    }

    if (userDto.captcha !== captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const userItem = await this.userRepository.findOneBy({
      username: userDto.username,
    });

    if (userItem) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const user = new User();
    user.username = userDto.username;
    user.password = md5(userDto.password);
    user.email = userDto.email;
    user.nickname = userDto.nickname;
    try {
      await this.userRepository.save(user);
      return '注册成功';
    } catch (e) {
      return '注册失败';
    }
  }

  /**
   * 登录
   * @param loginUser
   * @param clientInfo
   */
  async login(loginUser: LoginUserDto, clientInfo: any) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        isAdmin: USER_IS_ADMIN.YES,
      },
      select: ['username', 'password', 'roles', 'id', 'isFrozen'],
      relations: ['roles'],
    });

    if (!user) {
      this.recordLoginLog({ ...clientInfo, msg: '用户不存在', status: 0 }, user);
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUser.password)) {
      this.recordLoginLog({ ...clientInfo, msg: '密码错误', status: 0 }, user);
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    if (user.isFrozen === USER_IS_FROZEN.FROZEN) {
      this.recordLoginLog({ ...clientInfo, msg: '用户已被冻结', status: 0 }, user);
      throw new HttpException('您已被禁用，如需正常使用请联系管理员', HttpStatus.BAD_REQUEST);
    }

    const userVo = await this.findUserById(user.id);

    const tokenInfo = {
      userId: userVo.userInfo.id,
      username: userVo.userInfo.username,
      roles: userVo.userInfo.roles,
      permissions: userVo.userInfo.permissions,
    };

    const { accessToken, refreshToken } = this.setToken(tokenInfo, {
      userId: tokenInfo.userId,
    });

    userVo.accessToken = accessToken;
    userVo.refreshToken = refreshToken;

    // 将用户信息存入redis
    await this.redisService.set(
      `${CACHE_KEY.USER_INFO}${md5(`${user.username}-${user.id}`)}`,
      {
        ...userVo,
        ...clientInfo,
      },
      REDIS_LOGIN_USER_EXPIRE_TIME,
    );

    this.recordLoginLog({ ...clientInfo, msg: '登录成功', status: 1 }, user);

    return Result.ok({ accessToken: userVo.accessToken, refreshToken: userVo.refreshToken }, '登录成功');
  }

  /**
   * 刷新token
   * @param refresh
   */
  async refreshToken(refresh: string) {
    try {
      const data = this.jwtService.verify(refresh);

      const user = await this.findUserById(data.userId);

      const { accessToken, refreshToken } = this.setToken(
        {
          userId: user.userInfo.id,
          username: user.userInfo.username,
          roles: user.userInfo.roles,
          permissions: user.userInfo.permissions,
        },
        {
          userId: user.userInfo.id,
        },
      );

      user.accessToken = accessToken;

      user.refreshToken = refreshToken;

      return { accessToken: user.accessToken, refreshToken: user.refreshToken };
    } catch (e) {
      throw new UnauthorizedException('token无效,请重新登录');
    }
  }

  /**
   * 通过id查找用户 包括角色和权限
   * @param id
   */
  async findUserById(id: number) {
    const userInfo = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: ['roles'],
    });
    const userInfoVo = this.setUserInfo(userInfo);

    const roleIds = userInfo.roles.map((role) => role.id);

    // todo 根据角色id获取菜单权限
    if (id === 1) {
      userInfoVo.userInfo.permissions = ['*:*:*'];
    } else {
      // 根据角色id获取菜单权限
      userInfoVo.userInfo.permissions = await this.roleService.getRolePermissions(roleIds);
    }

    return userInfoVo;
  }

  async getUserDetail(id: number) {
    return await this.userRepository.findOneBy({
      id: id,
    });
  }

  /**
   * 设置用户信息
   * @param userInfo
   *
   */
  setUserInfo(userInfo: User): LoginUserVo {
    const userVo = new LoginUserVo();
    userVo.userInfo = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      nickname: userInfo.nickname,
      roles: userInfo.roles.map((role) => {
        return { id: role.id, name: role.name, code: role.roleCode };
      }),
      isFrozen: userInfo.isFrozen,
      headPic: userInfo.headPic,
      phoneNum: userInfo.phoneNumber,
      createTime: userInfo.createTime,
    };

    return userVo;
  }

  /**
   * 设置token
   * @param accTokenInfo
   * @param refTokenInfo
   */
  setToken(accTokenInfo, refTokenInfo): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(
      {
        ...accTokenInfo,
      },
      {
        expiresIn: this.configService.get('jwt.access_token_expires', { infer: true }) || '30m',
      } as JwtSignOptions,
    );

    const refreshToken = this.jwtService.sign(
      {
        ...refTokenInfo,
      },
      {
        expiresIn: this.configService.get('jwt.refresh_token_expires') || '7d',
      } as JwtSignOptions,
    );

    return { accessToken, refreshToken };
  }

  /**
   * 退出登录
   * @param userDto
   * @param id
   */
  async logout(id: number, clientInfo: any) {
    //根据id获取用户信息
    const userDto = await this.userRepository.findOneBy({
      id: id,
    });
    if (!userDto) {
      this.recordLoginLog({ ...clientInfo, msg: '退出登录失败,用户不存在', status: 0 }, userDto);
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    // 删除用户信息缓存
    await this.redisService.del(`${CACHE_KEY.USER_INFO}${md5(`${userDto.username}-${id}`)}`);

    // 删除用户菜单缓存
    await this.redisService.del(`${CACHE_KEY.USER_MENU}${md5(`${userDto.username}-${id}`)}`);
    this.recordLoginLog({ ...clientInfo, msg: '退出登录', status: 1 }, userDto);

    return Result.ok('退出登录成功');
  }

  /**
   * 记录登录日志
   */
  private async recordLoginLog(clientInfo: any, user?: User) {
    const loginLog = {
      username: user?.username || '',
      ipaddr: clientInfo.ip,
      loginTime: new Date(),
      createBy: user?.username || '',
      updateBy: user?.username || '',
      ...clientInfo,
    };
    await this.loginLogService.create(loginLog);
  }

  async sendCaptcha(email: string, type: CAPTCHA_TYPE) {
    const has =
      !type || ![CAPTCHA_TYPE.REGISTER, CAPTCHA_TYPE.UPDATE_PASSWORD, CAPTCHA_TYPE.UPDATE_INFO].includes(type);
    if (has) {
      throw new BadRequestException('验证码类型错误');
    }

    const captcha = Math.random().toString().slice(2, 8);

    const emailRedisInfo = {
      [CAPTCHA_TYPE.REGISTER]: {
        key: `captcha:${email}`,
        subject: '注册验证码',
      },
      [CAPTCHA_TYPE.UPDATE_PASSWORD]: {
        key: `captcha:update_password:${email}`,
        subject: '修改密码验证码',
      },
      [CAPTCHA_TYPE.UPDATE_INFO]: {
        key: `captcha:update_info:${email}`,
        subject: '更新信息验证码',
      },
    }[type];

    await this.redisService.set(emailRedisInfo.key, captcha, 60 * 5);

    await this.emailService.sendMail({
      to: email,
      subject: emailRedisInfo.subject,
      html: `<p>您的验证码是：<strong>${captcha}</strong> </p>`,
    });

    return '验证码已发送';
  }

  async getList(username: string, email: string, nickname: string, current = 1, size = 10) {
    // 获取查询条件符合的分页
    const _where: Record<string, any> = {};

    if (username) _where.username = Like(`%${username}%`);
    if (email) _where.email = Like(`%${email}%`);
    if (nickname) _where.nickname = Like(`%${nickname}%`);

    const count = await this.userRepository.count(_where);

    const { pageInfo, startRow } = getPagination(count, current, size);

    const [list] = await this.userRepository.findAndCount({
      where: _where,
      select: ['id', 'username', 'email', 'nickname', 'headPic', 'phoneNumber', 'createTime', 'isFrozen'],
      skip: startRow,
      take: size,
    } as FindManyOptions<User>);

    return {
      records: list,
      pagerInfo: pageInfo,
    };
  }
}
