import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DICT_SYSTEM_FLAG } from '@/common/enums';

export class CreateDictDto {
  @ApiProperty({ required: true, description: '字典名称' })
  @IsNotEmpty({ message: '字典名称不能为空' })
  dictName: string;

  @ApiProperty({ required: true, description: '字典编码' })
  @IsNotEmpty({ message: '字典编码不能为空' })
  @IsString({ message: '字典编码必须为文本' })
  @Length(5, 50, { message: '字典编码长度不能超过50' })
  @Matches(/^(?![_\W])[\u4e00-\u9fa5a-zA-Z0-9_]+$/, {
    message: '字典编码只能包含中文、英文、数字和下划线, 且不能以下划线开头',
  })
  dictCode: string;

  @ApiProperty({ required: false, description: '字典描述' })
  @IsOptional()
  @IsString({ message: '字典描述必须为文本' })
  @Length(0, 255, { message: '字典描述长度不能超过255' })
  dictDesc: string;

  @ApiProperty({ required: false, description: '系统标识' })
  @IsNotEmpty({ message: '系统标识不能为空' })
  @IsEnum(DICT_SYSTEM_FLAG, { message: '系统标识不在范围内' })
  systemFlag: string;
}

export class CreateDictDataDto {
  @ApiProperty({ required: true, description: '字典值' })
  @IsNotEmpty({ message: '字典值不能为空' })
  dictValue: string;

  @ApiProperty({ required: true, description: '字典标签' })
  @IsNotEmpty({ message: '字典标签不能为空' })
  dictLabel: string;

  @ApiProperty({ required: false, description: '字典描述' })
  @IsNotEmpty({ message: '字典描述不能为空' })
  dictDesc: string;

  @ApiProperty({ required: false, description: '字典备注' })
  @IsOptional()
  @Length(0, 255, { message: '字典备注长度不能超过255' })
  dictRemark: string;

  @ApiProperty({ required: false, description: '字典排序' })
  @IsOptional()
  @IsNumberString({}, { message: '字典排序必须为数字' })
  dictSort: number;

  @ApiProperty({ required: true, description: '字典类型ID' })
  @IsNotEmpty({ message: '字典类型ID不能为空' })
  dictTypeId: number;

  @ApiProperty({ required: false, description: '字典类型' })
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string;
}
