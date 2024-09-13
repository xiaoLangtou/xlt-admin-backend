import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ required: true, description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  roleName: string;

  @ApiProperty({ required: true, description: '角色标识' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  roleCode: string;

  @ApiProperty({ required: false, description: '角色描述' })
  @IsOptional()
  @Length(0, 50, { message: '角色描述不能超过50个字符' })
  description: string;

  @ApiProperty({ required: true, description: '是否启用' })
  @IsNotEmpty({ message: '是否启用不能为空' })
  @IsNumber({}, { message: '是否启用必须为数字' })
  // @IsEnum(STATUS_ENUM, { message: '是否启用不在范围内' })
  isEnable: number;

  @ApiProperty({ required: true, description: '排序值' })
  @IsNumber({}, { message: '排序值必须为数字' })
  sortOrder: number;

  @ApiProperty({ required: true, description: '菜单id' })
  @IsOptional()
  menus: number[];
}
