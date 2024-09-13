import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDeptDto } from '@/module/dept/dto/create-dept.dto';
import {
  RequireLogin,
  RequirePermissions,
  UserInfo,
} from '@/common/decorator/custom.decorator';
import { UpdateDeptDto } from '@/module/dept/dto/update-dept.dto';
import { ChangeDeptDto, QueryDeptDto } from '@/module/dept/dto/query-dept.dto';

@ApiTags('部门管理')
@Controller('dept')
@RequireLogin()
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @ApiOperation({ summary: '创建部门' })
  @ApiBody({
    required: true,
    type: CreateDeptDto,
  })
  @RequirePermissions('admin:dept:add')
  @Post('add')
  create(
    @Body() createDeptDto: CreateDeptDto,
    @UserInfo('username') username: string,
  ): any {
    return this.deptService.create(createDeptDto, username);
  }

  @ApiOperation({ summary: '更新部门' })
  @ApiBody({
    required: true,
    type: UpdateDeptDto,
  })
  @RequirePermissions('admin:dept:edit')
  @Post('edit')
  update(
    @Body() updateDeptDto: UpdateDeptDto,
    @UserInfo('username') username: string,
  ): any {
    return this.deptService.update(updateDeptDto, username);
  }

  @ApiOperation({ summary: '删除部门' })
  @ApiParam({
    required: true,
    name: 'deptId',
    type: Number,
  })
  @RequirePermissions('admin:dept:remove')
  @Delete('remove/:deptId')
  delete(
    @Param('deptId') deptId: number,
    @UserInfo('username') username: string,
  ): any {
    return this.deptService.remove(deptId, username);
  }

  @ApiOperation({ summary: '查询部门' })
  @ApiQuery({
    required: false,
    type: QueryDeptDto,
  })
  @RequirePermissions('admin:dept:list')
  @Get('list')
  query(@Query() queryDeptDto: QueryDeptDto): any {
    return this.deptService.findAll(queryDeptDto);
  }

  @ApiOperation({ summary: '查询部门树' })
  @RequirePermissions('admin:dept:tree')
  @Get('tree')
  queryTree(): any {
    return this.deptService.findDeptTree();
  }

  @ApiOperation({ summary: '查询部门详情' })
  @ApiParam({
    required: true,
    name: 'deptId',
    type: Number,
  })
  @RequirePermissions('admin:dept:detail')
  @Get('detail/:deptId')
  detail(@Param('deptId') deptId: number): any {
    return this.deptService.findOne(deptId);
  }

  @ApiOperation({ summary: '修改部门状态' })
  @ApiBody({
    required: true,
    type: ChangeDeptDto,
  })
  @RequirePermissions('admin:dept:change:status')
  @Put('change-status')
  changeStatus(
    @Body() changeDeptDto: ChangeDeptDto,
    @UserInfo('username') username: string,
  ): any {
    return this.deptService.changeDeptStatus(
      changeDeptDto.id,
      changeDeptDto.status,
      username,
    );
  }

  @ApiOperation({ summary: '生成部门代码和排序值' })
  @RequirePermissions('admin:dept:generate')
  @Get('generate-dept-constants')
  async generateDeptConstants(): Promise<any> {
    return await this.deptService.createDeptConstant();
  }
}
