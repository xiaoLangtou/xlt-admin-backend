import { PartialType } from '@nestjs/mapped-types';
import { CreateDeptDto } from './create-dept.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDeptDto extends PartialType(CreateDeptDto) {
  @ApiProperty({ required: true, description: '部门ID' })
  @IsNotEmpty({ message: '部门ID不能为空' })
  @IsNumber({}, { message: '部门ID必须为数字' })
  id: number;
}
