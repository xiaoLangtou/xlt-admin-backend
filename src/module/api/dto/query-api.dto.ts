/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-02-09 14:24:21
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-02-09 15:07:35
 * @FilePath: src/module/api/dto/query-api.dto.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PagerParamsDto } from '@/common/dto/index.dto';
import { REQUEST_METHOD } from '@/common/enums';
import { IsEnum, IsOptional } from 'class-validator';

export class QueryApiDto extends PartialType(PagerParamsDto) {

  @ApiPropertyOptional({
    description: '接口路径',
  })
  @IsOptional()
  path?: string;


  @ApiPropertyOptional({
    description: '接口描述',
  })
  @IsOptional()
  description?: string;


  @ApiPropertyOptional({
    description: '接口分组',
  })
  @IsOptional()
  tags?: string;

  @ApiPropertyOptional({
    description: '请求方式',
  })
  @IsEnum(REQUEST_METHOD, { message: '请求方式错误' })
  @IsOptional()
  method?: string;
}
