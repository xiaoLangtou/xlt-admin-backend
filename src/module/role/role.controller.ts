import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RequireLogin, RequirePermissions, UserInfo } from '@/common/decorator/custom.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryRoleDto, RoleMenuDto } from './dto/query-role.dto';
import { ChangeRoleDto, UpdateRoleDto, UsersToRoleDto } from './dto/update-role.dto';

@Controller('role')
@RequireLogin()
@ApiTags('角色管理')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: '添加角色',
  })
  @Post('add')
  @RequirePermissions('admin:role:add')
  create(@Body() createRoleDto: CreateRoleDto, @UserInfo('username') username: string) {
    return this.roleService.createRole(createRoleDto, username);
  }

  @ApiOperation({
    summary: '更新角色',
  })
  @RequirePermissions('admin:role:edit')
  @Post('edit')
  updateRole(@Body() updateRoleDto: UpdateRoleDto, @UserInfo('username') username: string) {
    return this.roleService.updateRole(updateRoleDto.id, updateRoleDto, username);
  }

  @ApiOperation({
    summary: '删除角色',
  })
  @RequirePermissions('admin:role:delete')
  @Post('remove/:id')
  removeRole(@Param('id') id: number, @UserInfo('username') username: string) {
    return this.roleService.deleteRole(id, username);
  }

  @ApiOperation({
    summary: '获取角色列表',
  })
  @RequirePermissions('admin:role:list')
  @Get('list')
  list(@Query() query: QueryRoleDto) {
    return this.roleService.getRoleList(query);
  }

  @ApiOperation({
    summary: '获取角色详情',
  })
  @ApiBody({
    required: true,
  })
  @RequirePermissions('admin:role:detail')
  @Get('detail/:id')
  detail(@Param('id') id: number) {
    return this.roleService.getRoleDetail(id);
  }

  @ApiOperation({
    summary: '修改角色状态',
  })
  @ApiBody({
    required: true,
    type: ChangeRoleDto,
  })
  @RequirePermissions('admin:role:status')
  @Put('changeStatus')
  changeStatus(@Body() changeRoleDto: ChangeRoleDto, @UserInfo('username') username: string) {
    return this.roleService.changeRoleStatus(changeRoleDto, username);
  }

  @ApiOperation({
    summary: '修改角色菜单权限',
  })
  @ApiBody({
    required: true,
    type: RoleMenuDto,
  })
  @RequirePermissions('admin:role:menu')
  @Put('changeMenu')
  changeMenu(@Body() roleMenu: RoleMenuDto) {
    return this.roleService.setRoleMenus(roleMenu.id, roleMenu.menus);
  }

  @ApiOperation({
    summary: '角色分配用户',
  })
  @ApiBody({
    required: true,
    type: UsersToRoleDto,
  })
  @RequirePermissions('admin:role:users')
  @Post('add/users')
  addUsersToRole(@Body() usersToRoleDto: UsersToRoleDto) {
    return this.roleService.addUsersToRole(usersToRoleDto.roleId, usersToRoleDto.users);
  }

  @ApiOperation({ summary: '移除角色用户' })
  @ApiBody({ required: true, type: UsersToRoleDto })
  @RequirePermissions('admin:role:users:remove')
  @Put('remove/users')
  removeUsersToRole(@Body() usersToRoleDto: UsersToRoleDto) {
    return this.roleService.removeUsersFromRole(usersToRoleDto.roleId, usersToRoleDto.users);
  }
}
