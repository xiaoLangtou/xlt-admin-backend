import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PagerParamsDto } from '@/common/dto/index.dto';

export class CreateLoggerDto {
  @IsOptional()
  logType: string;

  @IsOptional()
  logContent: string;

  // 请求参数
  @IsOptional()
  requestParam: string;

  // 请求地址
  @IsOptional()
  requestUrl: string;

  // 请求方法
  @IsOptional()
  requestMethod: string;

  // 请求IP
  @IsOptional()
  requestIp: string;

  // 请求ip地址
  @IsOptional()
  requestIpAddr: string;

  // 请求耗时
  @IsOptional()
  requestTimeConsume: string;

  //浏览器类型
  @IsOptional()
  browser: string;

  // 操作系统
  @IsOptional()
  os: string;

  // 所属模块
  @IsOptional()
  module: string;

  // 响应头
  @IsOptional()
  responseHeader: string;

  // 响应体
  @IsOptional()
  responseBody: string;

  // 请求头
  @IsOptional()
  requestHeader: string;

  // 请求体
  @IsOptional()
  requestBody: string;

  status: number;
}

export class QueryLoggerDto extends PartialType(PagerParamsDto) {
  @ApiProperty({ description: '创建人' })
  @IsOptional()
  createBy: string;

  @ApiProperty({ description: '请求IP' })
  @IsOptional()
  ip: string;

  @ApiProperty({ description: '开始时间' })
  @IsOptional()
  startTime: string;

  @ApiProperty({ description: '结束时间' })
  @IsOptional()
  endTime: string;
}

export class QueryLoggerDetailDto {
  @ApiProperty({ description: '日志ID' })
  @IsNumberString({}, { message: '日志ID必须为数字' })
  @IsNotEmpty({ message: '日志ID不能为空' })
  id: number;
}
