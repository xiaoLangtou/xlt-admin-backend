import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { USER_IS_FROZEN } from '@/common/enums';
import { PagerParamsDto } from '@/common/dto/index.dto';

export class QueryUserDto extends PartialType(PagerParamsDto) {
  @ApiProperty({ type: String, description: '用户名' })
  @IsOptional()
  username: string;

  @ApiProperty({ description: '昵称' })
  @IsOptional()
  nickname: string;

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  email: string;

  @ApiProperty({ description: '姓名' })
  @IsOptional()
  name: string;

  @ApiProperty({ description: '手机号' })
  phone: string;

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @ValidateIf((o) => o.status)
  @IsEnum(USER_IS_FROZEN, { message: '状态值错误' })
  status: string;

  @ApiProperty({ description: '开始时间' })
  @IsOptional()
  beginTime: string;

  @ApiProperty({ description: '结束时间' })
  @IsOptional()
  endTime: string;

  @ApiProperty({ description: '部门id' })
  @IsOptional()
  deptId: number;
}

export class QueryUserWithRolesDto extends PartialType(PagerParamsDto) {
  @ApiProperty({ type: String, description: '用户名' })
  @IsOptional()
  username: string;

  @ApiProperty({ description: '昵称' })
  @IsOptional()
  nickname: string;

  @ApiProperty({ description: '邮箱' })
  @IsOptional()
  email: string;

  @ApiProperty({ description: '手机号' })
  phone: string;

  @ApiProperty({ description: '状态' })
  @IsOptional()
  @ValidateIf((o) => o.status)
  @IsEnum(USER_IS_FROZEN, { message: '状态值错误' })
  status: string;

  @ApiProperty({ required: true, description: '角色id' })
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: number;
}

export class RemoveUserRoleDto {
  @ApiProperty({ description: '用户id' })
  @IsNotEmpty({ message: '用户id不能为空' })
  userId: number;

  @ApiProperty({ description: '角色id' })
  @IsNotEmpty({ message: '角色id不能为空' })
  roleId: number;
}

export class RemoveUserDto {
  @ApiProperty({ description: '用户id' })
  @IsNotEmpty({ message: '用户id不能为空' })
  @IsNumberString({}, { message: '用户id必须为数字' })
  id: number;
}
