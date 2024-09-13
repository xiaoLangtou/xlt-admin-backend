import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ type: String, description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(2, { message: '用户名至少两个字符' })
  @MaxLength(10, { message: '用户名最多10个字符' })
  username: string;

  @ApiProperty({ description: '昵称' })
  @IsNotEmpty({ message: '昵称不能为空' })
  @MinLength(2, { message: '昵称至少两个字符' })
  @MaxLength(10, { message: '昵称最多10个字符' })
  nickname: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '姓名' })
  @IsOptional()
  @ValidateIf((o) => o.name)
  @MinLength(2, { message: '姓名至少两个字符' })
  @MaxLength(10, { message: '姓名最多10个字符' })
  name: string;

  @ApiProperty({ description: '手机号' })
  @IsNotEmpty({ message: '手机号不能为空' })
  @IsMobilePhone('zh-CN')
  phone: string;

  @ApiProperty({ description: '部门ID' })
  @IsNotEmpty({ message: '部门ID不能为空' })
  @IsNumber({}, { message: '部门ID必须为数字' })
  deptId: number;

  @ApiProperty({ description: '岗位' })
  @IsOptional()
  post: number[];

  @ApiProperty({ description: '角色' })
  @IsOptional()
  roles: number[];

  @ApiProperty({ description: '密码' })
  @IsOptional()
  password: string;

  @ApiProperty({ description: '性别' })
  @IsOptional()
  sex: number;

  @ApiProperty({ description: '备注' })
  @IsOptional()
  @MaxLength(255, { message: '备注最多255个字符' })
  remark: string;

  @ApiProperty({ description: '工号' })
  @IsOptional()
  jobNumber: string;
}

export class RegisterUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
