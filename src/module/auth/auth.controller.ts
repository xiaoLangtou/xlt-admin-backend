import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '@/module/user/dto/create-user.dto';
import { LoginUserDto } from '@/module/user/dto/login-user.dto';
import { CAPTCHA_TYPE } from '@/common/enums';
import { RequireLogin, UserInfo } from '@/common/decorator/custom.decorator';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Result } from '@/common/utils/result';
import * as UserA from 'useragent';

@ApiTags('登录/注册')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: RegisterUserDto) {
    return await this.authService.register(createUserDto);
  }

  @ApiQuery({
    name: 'email',
    type: String,
    required: true,
    description: '邮箱',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '验证码发送成功',
    type: String,
  })
  @Get('/captcha')
  async captcha(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('邮箱不能为空');
    }

    return await this.authService.sendCaptcha(email, CAPTCHA_TYPE.REGISTER);
  }

  @Post('/login')
  async login(@Body() loginUser: LoginUserDto, @Request() request: any) {
    const agent = UserA.parse(request.headers['user-agent']);
    const os = agent.os.toJSON().family;
    const browser = agent.toAgent();
    const clientInfo = {
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      os: os,
      browser: browser,
      location: '',
    };
    return await this.authService.login(loginUser, clientInfo);
  }

  @Get('/refresh-token')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }

  @Get('/info')
  @RequireLogin()
  async info(@UserInfo('userId') id: number) {
    if (!id) {
      throw new BadRequestException('用户ID不能为空');
    }
    return Result.ok(await this.authService.findUserById(id));
  }

  @Post('/update/captcha')
  @RequireLogin()
  async updateCaptcha(@UserInfo('userId') userId: number, @Query('type') type: CAPTCHA_TYPE) {
    const userInfo = await this.authService.getUserDetail(userId);
    return await this.authService.sendCaptcha(userInfo.email, type);
  }

  @RequireLogin()
  @Get('/permission')
  async getUserPermission(@UserInfo('permissions') permissions: any) {
    return Result.ok(permissions);
  }

  @RequireLogin()
  @Post('/logout')
  async logout(@UserInfo('userId') userId: number, @Request() request: any) {
    const agent = UserA.parse(request.headers['user-agent']);
    const os = agent.os.toJSON().family;
    const browser = agent.toAgent();
    const clientInfo = {
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      os: os,
      browser: browser,
      location: '',
    };
    return await this.authService.logout(userId, clientInfo);
  }
}
