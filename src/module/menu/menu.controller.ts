import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { RequireLogin, RequirePermissions, UserInfo } from '@/common/decorator/custom.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from '@/module/menu/dto/update-menu.dto';

@ApiTags('菜单管理')
@RequireLogin()
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({
    summary: '获取菜单树',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @RequirePermissions('admin:menu:list')
  @Get('/tree')
  async findMenuTree(@Query('name') name: string) {
    return await this.menuService.getMenuTreeList(name);
  }

  @ApiOperation({
    summary: '创建菜单',
  })
  @ApiBody({ type: CreateMenuDto, required: true })
  @RequirePermissions('admin:menu:add')
  @Post('/create')
  async createMenu(@UserInfo('username') username: string, @Body() menuDto: CreateMenuDto) {
    return await this.menuService.createMenuItem(menuDto, username);
  }

  @ApiOperation({
    summary: '删除菜单',
  })
  @ApiParam({
    name: 'menuId',
    type: Number,
    required: true,
  })
  @RequirePermissions('admin:menu:delete')
  @Delete('/delete/:menuId')
  async deleteMenu(@Param('menuId') menuId: number, @UserInfo('username') username: string) {
    return await this.menuService.deleteMenuItem(menuId, username);
  }

  @ApiOperation({
    summary: '获取菜单详情',
  })
  @ApiParam({
    name: 'menuId',
    type: Number,
    required: true,
  })
  @RequirePermissions('admin:menu:detail')
  @Get('/detail/:menuId')
  async getMenuDetail(@Param('menuId') menuId: number) {
    return await this.menuService.getMenuItemDetail(menuId);
  }

  @ApiOperation({
    summary: '更新菜单',
  })
  @ApiBody({ type: UpdateMenuDto, required: true })
  @RequirePermissions('admin:menu:edit')
  @Post('/update')
  async updateMenu(@UserInfo('username') username: string, @Body() menuDto: UpdateMenuDto) {
    return await this.menuService.updateMenuItem(menuDto, username);
  }

  /**
   * 获取用户菜单列表
   * @param roles
   */
  @ApiOperation({
    summary: '获取用户菜单列表',
  })
  @RequirePermissions('admin:menu:user:list')
  @Get('/user/list')
  async getUserMenuList(@UserInfo('roles') roles: any[]) {
    return await this.menuService.getUserMenuList(roles);
  }
}
