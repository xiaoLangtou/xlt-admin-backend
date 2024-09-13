import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { DictService } from './dict.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateDictDataDto,
  CreateDictDto,
} from '@/module/dict/dto/create-dict.dto';
import {
  RequireLogin,
  RequirePermissions,
  UserInfo,
} from '@/common/decorator/custom.decorator';
import {
  UpdateDictDataDto,
  UpdateDictDto,
} from '@/module/dict/dto/update-dict.dto';

@ApiTags('字典管理')
@Controller('dict')
@RequireLogin()
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @ApiOperation({
    summary: '添加字典',
  })
  @ApiBody({
    required: true,
    type: CreateDictDto,
  })
  @Post('add')
  @RequirePermissions('system:dict:add')
  async createDict(
    @Body() createDictDto: CreateDictDto,
    @UserInfo('username') username: string,
  ): Promise<any> {
    return this.dictService.createDictType(createDictDto, username);
  }

  @ApiOperation({
    summary: '更新字典',
  })
  @ApiBody({
    required: true,
    type: UpdateDictDto,
  })
  @RequirePermissions('system:dict:edit')
  @Post('update')
  async updateDict(
    @Body() updateDictDto: UpdateDictDto,
    @UserInfo('username') username: string,
  ): Promise<any> {
    return this.dictService.updateDictType(updateDictDto, username);
  }

  @ApiOperation({
    summary: '删除字典',
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: Number,
  })
  @RequirePermissions('system:dict:remove')
  @Delete('remove/:id')
  async removeDict(@Param('id') id: number): Promise<any> {
    return this.dictService.deleteDictType(id);
  }

  @ApiOperation({
    summary: '获取字典列表',
  })
  @ApiQuery({
    required: false,
    name: 'name',
    type: String,
  })
  @RequirePermissions('system:dict:list')
  @Get('list')
  async getList(@Query('name') dictName: string): Promise<any> {
    return this.dictService.findDictTypeList(dictName);
  }

  @ApiOperation({
    summary: '获取字典详情',
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: Number,
  })
  @RequirePermissions('system:dict:detail')
  @Get('detail/:id')
  async getDictTypeDetail(@Param('id') id: number): Promise<any> {
    return this.dictService.findDictTypeById(id);
  }

  @ApiOperation({
    summary: '获取字典数据列表',
  })
  @ApiQuery({
    required: true,
    name: 'typeId',
    type: Number,
  })
  @ApiQuery({
    required: false,
    name: 'current',
    type: Number,
  })
  @ApiQuery({
    required: false,
    name: 'size',
    type: Number,
  })
  @RequirePermissions('system:dict:data:list')
  @Get('data/list')
  async getDictDataList(
    @Query('typeId') dictTypeId: number,
    @Query('current') current: number,
    @Query('size') size: number,
  ): Promise<any> {
    return this.dictService.findDictDataList(dictTypeId, current, size);
  }

  @ApiOperation({
    summary: '添加字典数据',
  })
  @ApiBody({
    required: true,
    type: CreateDictDataDto,
  })
  @RequirePermissions('system:dict:data:add')
  @Post('data/add')
  async createDictData(
    @Body() createDictDataDto: CreateDictDataDto,
    @UserInfo('username') username: string,
  ): Promise<any> {
    return this.dictService.addDictData(createDictDataDto, username);
  }

  @ApiOperation({
    summary: '更新字典数据',
  })
  @ApiBody({
    required: true,
    type: UpdateDictDataDto,
  })
  @RequirePermissions('system:dict:data:edit')
  @Post('data/update')
  async updateDictData(
    @Body() dictDataDto: UpdateDictDataDto,
    @UserInfo('username') username: string,
  ): Promise<any> {
    return this.dictService.updateDictData(dictDataDto, username);
  }

  @ApiOperation({
    summary: '删除字典数据',
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: Number,
  })
  @RequirePermissions('system:dict:data:remove')
  @Delete('data/remove/:id')
  async removeDictData(
    @Param('id') id: number,
    @UserInfo('username') username: string,
  ): Promise<any> {
    return this.dictService.deleteDictData(id, username);
  }

  @ApiOperation({
    summary: '获取字典数据详情',
  })
  @ApiParam({
    required: true,
    name: 'id',
    type: Number,
  })
  @RequirePermissions('system:dict:data:detail')
  @Get('data/detail/:id')
  async getDictDataDetail(@Param('id') id: number): Promise<any> {
    return this.dictService.findDictDataDetailById(id);
  }

  @ApiOperation({
    summary: '根据字典类型获取字典数据列表',
  })
  @ApiParam({
    required: true,
    name: 'type',
    type: String,
  })
  @RequirePermissions('system:dict:data:detail:list')
  @Get('data/type-detail/:type')
  async getDictDataDetailByType(@Param('type') type: string): Promise<any> {
    return this.dictService.findDictDataDetailByType(type);
  }

  @ApiOperation({
    summary: '根据字典类型获取字典数据对象',
  })
  @ApiQuery({
    required: true,
    name: 'type',
    type: String,
  })
  @RequirePermissions('system:dict:data:detail:object')
  @Get('data/type-detail')
  async getDictDataObjByType(@Query('type') type: string): Promise<any> {
    return this.dictService.findDictDataAsObjectByType(type);
  }
}
