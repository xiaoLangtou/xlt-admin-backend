import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUserDto, RegisterUserDto } from './create-user.dto';
import { USER_IS_FROZEN } from '@/common/enums';

// 系统用户更新用户信息
export class UpdateUserInfoDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: true, description: '用户id' })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: number;
}

// 当前用户自己更新信息
export class UpdateActiveUserInfoDto extends IntersectionType(
  RegisterUserDto,
  UpdateUserInfoDto,
) {
  @ApiProperty({ required: false, description: '用户头像' })
  @IsOptional()
  headPic: string;
}

/**
 * 修改用户状态
 */
export class ChangeUserStatusDto {
  @ApiProperty({ required: true, description: '用户id' })
  @IsNotEmpty({ message: '用户id不能为空' })
  id: number;

  @ApiProperty({ required: true, description: '状态' })
  @IsEnum(USER_IS_FROZEN, { message: '状态不在范围内' })
  @IsNotEmpty({ message: '状态不能为空' })
  status: string;
}
