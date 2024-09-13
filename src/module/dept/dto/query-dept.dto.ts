import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class QueryDeptDto {
  @ApiProperty({ required: false, description: '部门名称' })
  name: string;

  @ApiProperty({ required: false, description: '部门编码' })
  code: string;

  @ApiProperty({ required: false, description: '父级ID' })
  pid: number;

  @ApiProperty({ required: false, description: '状态' })
  status: number;
}

export class ChangeDeptDto {
  @ApiProperty({ required: true, description: '部门id' })
  @IsNotEmpty({ message: '部门id不能为空' })
  @IsNumber({}, { message: '部门id必须为数字' })
  id: number;

  @ApiProperty({ required: true, description: '是否启用' })
  @IsNotEmpty({ message: '是否启用不能为空' })
  @IsNumber({}, { message: '是否启用必须为数字' })
  status: number;
}
