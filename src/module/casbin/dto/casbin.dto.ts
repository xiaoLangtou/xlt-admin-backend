/**
 * @Author: weipc 755197142@qq.com
 * @Date: 2025-02-09 14:24:21
 * @LastEditors: weipc 755197142@qq.com
 * @LastEditTime: 2025-02-15 19:42:20
 * @FilePath: src/module/casbin/dto/casbin.dto.ts
 * @Description: 这是默认设置,可以在设置》工具》File Description中进行配置
 */
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CasbinDto {

  @ApiProperty({
    description: '接口列表',
  })
  @ArrayMinSize(1, { message: '接口列表不能为空' })
  @IsArray({ message: '接口列表不能为空' })
  apis: { path: string; method: string; [key: string]: any }[];

  @ApiProperty({
    description: '角色代码',
  })
  @IsNotEmpty({ message: '角色代码不能为空' })
  roleCode: string;

}

