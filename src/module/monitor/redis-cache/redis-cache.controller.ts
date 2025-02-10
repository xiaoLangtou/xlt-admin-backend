import { Controller, Get } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Redis缓存模块')
@ApiBearerAuth()
@Controller('redis-cache')
export class RedisCacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  @ApiOperation({ summary: '获取Redis运行信息' })
  @Get('info')
  async getRedisInfo() {
    return await this.redisCacheService.getRedisInfo();
  }
}
