import { SORT_ORDER } from './../../../common/constant/index';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';
import { STATUS_ENUM } from '@/common/enums';

export class CreatePostDto {
  @ApiProperty({ type: String, description: '岗位名称' })
  @IsNotEmpty({ message: '岗位名称不能为空' })
  name: string;

  @ApiProperty({ type: String, description: '岗位编码' })
  @IsNotEmpty({ message: '岗位编码不能为空' })
  code: string;

  @ApiProperty({ type: String, description: '岗位描述' })
  @IsOptional()
  @Length(0, 100, { message: '岗位描述不能超过100个字符' })
  description: string;

  @ApiProperty({ type: Number, description: '排序' })
  @IsNumber({}, { message: '排序必须为数字' })
  [SORT_ORDER]: number;

  @ApiProperty({ type: Number, description: '状态' })
  @IsOptional()
  @IsEnum(STATUS_ENUM, { message: '状态必须是枚举值' })
  status: number;
}
