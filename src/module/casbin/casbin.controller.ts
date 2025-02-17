import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CasbinService } from '@/module/casbin/casbin.service';
import { Result } from '@/common/utils/result';
import { CasbinDto } from '@/module/casbin/dto/casbin.dto';
import { RequireLogin } from '@/common/decorator/custom.decorator';

@ApiTags('casbin')
@ApiBearerAuth()
@RequireLogin()
@Controller('casbin')
export class CasbinController {

  constructor(private casbinService: CasbinService) {
  }

  @ApiOperation({ summary: '获取权限列表' })
  @Get('permission-list')
  async getPermissionList(@Query('code') code: string) {
    const result = await this.casbinService.getPermissionsForUser(code);
    const permissionApis = result.map(item => {
      return {
        path: item[1],
        method: item[2],
      };
    });

    return Result.ok(permissionApis);
  }


  @ApiOperation({ summary: '更新角色权限' })
  @ApiBody({
    type: CasbinDto,
    description: '角色权限',
  })
  @Post('update-role-permission')
  async updateRoleApiPermission(@Body() casbinDto: CasbinDto) {
    const { roleCode, apis } = casbinDto;
    const permission = apis.map(api => {
      return [api.path, api.method];
    });

    const result = await this.casbinService.addPermissionsForUser(roleCode, permission);

    return Result.ok(result);
  }


}
