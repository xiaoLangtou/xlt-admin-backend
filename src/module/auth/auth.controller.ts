import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '@/module/user/dto/create-user.dto';

import { LoginUserDto } from '@/module/user/dto/login-user.dto';
import { CAPTCHA_TYPE, USER_IS_ADMIN } from '@/common/enums';
import { RequireLogin, UserInfo } from '@/common/decorator/custom.decorator';
import { UpdateUserPasswordDto } from '@/module/user/dto/update-password.dto';
import { UpdateActiveUserInfoDto } from '@/module/user/dto/update-info.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Result } from '@/common/utils/result';

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
  async login(@Body() loginUser: LoginUserDto) {
    return await this.authService.login(loginUser, USER_IS_ADMIN.YES);
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

  @Get('/details/:id')
  @RequireLogin()
  async userDetails(@Param('id') id: number) {
    if (!id) {
      throw new BadRequestException('用户ID不能为空');
    }
    return await this.authService.findUserById(id);
  }

  @Post(['/update_password', '/admin/update_password'])
  @RequireLogin()
  async update(
    @UserInfo('userId') id: number,
    @Body() userDto: UpdateUserPasswordDto,
  ) {
    return this.authService.updateUserPassword(userDto, id);
  }

  @Post(['/update_info', '/admin/update_info'])
  @RequireLogin()
  async updateInfo(@Body() userDto: UpdateActiveUserInfoDto) {
    return this.authService.updateUserInfo(userDto);
  }

  @Post('/update/captcha')
  @RequireLogin()
  async updateCaptcha(
    @UserInfo('userId') userId: number,
    @Query('type') type: CAPTCHA_TYPE,
  ) {
    const userInfo = await this.authService.getUserDetail(userId);

    return await this.authService.sendCaptcha(userInfo.email, type);
  }

  @Post('/freeze')
  async freeze(@Body('id') userId: number) {
    if (!userId) {
      throw new BadRequestException('用户ID不能为空');
    }

    await this.authService.freezeUser(userId);
    return '冻结成功';
  }
}
