import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { STATUS_ENUM } from '@/common/enums';

/**
 * 更新角色dto
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ required: true, description: '角色id' })
  @IsNotEmpty({ message: '角色id不能为空' })
  @IsNumber({}, { message: '角色id必须为数字' })
  id: number;
}

/**
 * 修改角色状态dto
 */
export class ChangeRoleDto {
  @ApiProperty({ required: true, description: '角色id' })
  @IsNumber({}, { message: '角色id必须为数字' })
  roleId: number;

  @ApiProperty({ required: true, description: '是否启用' })
  @IsNumber({}, { message: '是否启用必须为数字' })
  @IsEnum(STATUS_ENUM, { message: '是否启用不在范围内' })
  isEnable: number;
}

/**
 * 角色分配用户dto
 */
export class UsersToRoleDto {
  @ApiProperty({ required: true, description: '角色id' })
  @IsNumber({}, { message: '角色id必须为数字' })
  roleId: number;

  @ApiProperty({ required: true, description: '用户id' })
  @IsNotEmpty({ message: '用户id不能为空' })
  users: number[];
}
