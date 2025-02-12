/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-02-09 14:24:21
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-02-11 14:07:03
 * @FilePath: src/module/api/dto/create-api.dto.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { REQUEST_METHOD } from '@/common/enums';
import { IsEnum } from 'class-validator';
import { CommonIdDto } from '@/common/dto/index.dto';

export class CreateApiDto {

  @ApiProperty({
    description: '接口路径',
  })
  path: string;


  @ApiProperty({
    description: '接口描述',
  })
  description: string;


  @ApiProperty({
    description: '接口分组',
  })
  tags: string;

  @ApiProperty({
    description: '请求方式',
  })
  @IsEnum(REQUEST_METHOD, { message: '请求方式错误' })
  method: string;
}


export class UpdateApiDto extends IntersectionType(CreateApiDto, CommonIdDto) {
}


export class IgnoreApiDto extends PartialType(OmitType(CreateApiDto, ['tags'] as const)) {
  @ApiProperty({
    description: '忽略标记',
  })
  ignore: number;
}
