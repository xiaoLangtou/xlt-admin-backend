import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { DEPT_TYPE } from '@/common/enums';

export class CreateDeptDto {
  @ApiProperty({ required: true, description: '部门名称' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  deptName: string;

  @ApiProperty({ required: true, description: '部门编码' })
  @IsNotEmpty({ message: '部门编码不能为空' })
  deptCode: string;

  @ApiProperty({ required: true, description: '部门全称' })
  @IsNotEmpty({ message: '部门全称不能为空' })
  fullName: string;

  @ApiProperty({ required: true, description: '父级ID' })
  @IsOptional()
  @IsNumber({}, { message: '父级ID必须为数字' })
  parentId: number;

  @ApiProperty({ required: true, description: '排序' })
  @IsNotEmpty({ message: '排序不能为空' })
  @IsNumber({}, { message: '排序必须为数字' })
  orderNum: number;

  @ApiProperty({ required: true, description: '部门类型' })
  @IsNotEmpty({ message: '部门类型不能为空' })
  @IsEnum(DEPT_TYPE, { message: '部门类型不在范围内' })
  deptType: string;

  @ApiProperty({ required: false, description: '负责人' })
  @IsOptional()
  leader: string;

  @ApiProperty({ required: false, description: '联系电话' })
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false, description: '邮箱' })
  @IsOptional()
  email: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsOptional()
  remark: string;

  @ApiProperty({ required: false, description: '地址' })
  @IsOptional()
  address: string;

  @ApiProperty({ required: false, description: '邮政编码' })
  @IsOptional()
  postalCode: string;
}
