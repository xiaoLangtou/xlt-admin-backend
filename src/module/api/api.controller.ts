import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from '@/common/decorator/custom.decorator';
import { QueryApiDto } from '@/module/api/dto/query-api.dto';
import { CreateApiDto, IgnoreApiDto, UpdateApiDto } from '@/module/api/dto/create-api.dto';

@ApiTags('api管理')
@ApiBearerAuth()
@Controller('api')
@RequireLogin()
export class ApiController {
  constructor(private readonly apiService: ApiService) {
  }

  @ApiOperation({
    summary: '同步api',
  })

  @Get('synchronous')
  async synchronousApiJson() {
    return await this.apiService.synchronousApi();
  }


  @ApiOperation({
    summary: '获取api列表',
  })

  @Get('list')
  async getApiList(@Query() query: QueryApiDto) {
    return await this.apiService.getApiList(query);
  }


  @ApiOperation({
    summary: '获取api详情',
  })

  @Get('detail/:id')
  async getApiDetail(@Param('id') id: number) {
    return await this.apiService.getApiDetail(id);
  }


  @ApiOperation({
    summary: '删除api',
  })
  @Get('remove')
  async deleteApi(@Param('id') id: number) {
    return await this.apiService.deleteApi(id);
  }

  @ApiOperation({
    summary: '获取api分组',
  })
  @Get('group')
  async getApiGroup() {
    return await this.apiService.getApiGroup();
  }


  @ApiOperation({
    summary: '新增api',
  })
  @Post('add')
  async createApi(@Body() createApiDto: CreateApiDto) {
    return await this.apiService.createApi(createApiDto);
  }


  @ApiOperation({
    summary: '更新api',
  })
  @Post('update')
  async updateApi(@Body() createApiDto: UpdateApiDto) {
    return await this.apiService.updateApi(createApiDto);
  }

  @ApiOperation({
    summary: '忽略api',
  })
  @Post('ignore')
  async ignoreApi(@Body() ignoreApiDto: IgnoreApiDto) {
    return await this.apiService.ignoreApi(ignoreApiDto);
  }


  @ApiOperation({
    summary: '批量同步接口',
  })
  @Post('batch-apis')
  async batchApis(@Body() apis: CreateApiDto[]) {
    return await this.apiService.batchApis(apis);
  }


  @ApiOperation({
    summary: '获取所有的api',
  })
  @Get('all')
  async getAllApis() {
    return await this.apiService.getAllApis();
  }

}

