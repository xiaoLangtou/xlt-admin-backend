import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireLogin } from '@/common/decorator/custom.decorator';
import { QueryApiDto } from '@/module/api/dto/query-api.dto';

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
}
