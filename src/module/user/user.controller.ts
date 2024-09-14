import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RequireLogin, RequirePermissions, UserInfo } from '@/common/decorator/custom.decorator';
import { UserService } from '@/module/user/user.service';
import { CreateUserDto } from '@/module/user/dto/create-user.dto';
import { ChangeUserStatusDto, ResetPasswordDto, UpdateUserInfoDto } from '@/module/user/dto/update-info.dto';
import { BatchRemoveUserDto, QueryUserDto, QueryUserWithRolesDto, RemoveUserDto, RemoveUserRoleDto } from '@/module/user/dto/query-user.dto';

@ApiTags('用户管理模块')
@Controller('user')
@RequireLogin()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto, required: true })
  @RequirePermissions('admin:user:add')
  @Post('add')
  async create(@Body() createUserDto: CreateUserDto, @UserInfo('username') username: string) {
    return this.userService.create(createUserDto, username);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiBody({ type: UpdateUserInfoDto, required: true })
  @RequirePermissions('admin:user:edit')
  @Post('edit')
  async updated(@Body() userDto: UpdateUserInfoDto, @UserInfo('username') username: string) {
    return this.userService.updated(userDto, username);
  }

  @ApiOperation({ summary: '用户详情' })
  @ApiParam({ name: 'id', description: '用户id' })
  @RequirePermissions('admin:user:detail')
  @Get('detail/:id')
  async detail(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户id' })
  @RequirePermissions('admin:user:delete')
  @Delete('remove/:id')
  async delete(@Param() removeDto: RemoveUserDto, @UserInfo('username') username: string) {
    return this.userService.deleteUserById(removeDto.id, username);
  }

  @ApiOperation({ summary: '用户列表' })
  @ApiBody({ type: QueryUserDto, required: false })
  @RequirePermissions('admin:user:list')
  @Get('list')
  async list(@Query() queryUserDto: QueryUserDto) {
    return this.userService.getUserList(queryUserDto);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiBody({ type: ChangeUserStatusDto, required: true })
  @RequirePermissions('admin:user:change:status')
  @Put('status')
  async changeStatus(@Body() changeUserStatusDto: ChangeUserStatusDto, @UserInfo('username') username: string) {
    return this.userService.changeStatus(changeUserStatusDto.id, changeUserStatusDto.status, username);
  }

  @ApiOperation({ summary: '根据角色ID获取用户' })
  @ApiQuery({ type: QueryUserWithRolesDto, description: '角色id' })
  @RequirePermissions('admin:user:role:list')
  @Get('role/list')
  async getUserByRId(@Query() query: QueryUserWithRolesDto) {
    return this.userService.getUserListByRoleId(query);
  }

  @ApiOperation({ summary: '移除用户角色' })
  @ApiBody({ type: RemoveUserRoleDto, required: true })
  @RequirePermissions('admin:user:role:remove')
  @Put('remove/role')
  async removeRole(@Body() removeUserRoleDto: RemoveUserRoleDto) {
    return this.userService.removeUserRole(removeUserRoleDto);
  }

  @ApiOperation({ summary: '重置密码' })
  @ApiBody({ type: ResetPasswordDto, required: true })
  @RequirePermissions('admin:user:reset:password')
  @Put('reset/password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @UserInfo('username') username: string) {
    return this.userService.resetPassword(resetPasswordDto.ids, username);
  }

  @ApiOperation({ summary: '批量删除用户' })
  @ApiBody({ type: BatchRemoveUserDto, required: true })
  @RequirePermissions('admin:user:batch:delete')
  @Put('remove/batch')
  async batchDelete(@Body() removeUserDto: BatchRemoveUserDto, @UserInfo('username') username: string) {
    return this.userService.batchDelete(removeUserDto.ids, username);
  }
}
