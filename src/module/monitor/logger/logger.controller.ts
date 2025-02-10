import { Controller, Get, Query } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { QueryLoggerDetailDto, QueryLoggerDto } from '@/module/monitor/logger/dto/logger.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('系统日志模块')
@ApiBearerAuth()
@Controller('logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @ApiOperation({ summary: '系统日志列表-分页' })
  @Get('list')
  async getLogList(@Query() query: QueryLoggerDto) {
    return await this.loggerService.getSystemLoggerList(query);
  }

  @ApiOperation({ summary: '系统日志详情' })
  @Get('detail')
  async getLogDetail(@Query() query: QueryLoggerDetailDto) {
    return await this.loggerService.getSystemLoggerDetail(query.id);
  }
}
