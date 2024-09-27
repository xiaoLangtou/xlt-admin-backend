import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoginLogDto {
  @ApiProperty({ required: false, description: '登录ip地址' })
  @IsOptional()
  @IsString()
  ipaddr?: string;

  @ApiProperty({ required: false, description: '登录用户' })
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty({ required: false, description: '登录地区' })
  @IsOptional()
  @IsString()
  loginLocation: string;

  @ApiProperty({ required: false, description: '登录状态' })
  @IsOptional()
  @IsString()
  status: string;

  @ApiProperty({ required: false, description: '登录时间' })
  @IsOptional()
  @IsString()
  time: string;

  @ApiProperty({ required: false, description: '登录浏览器' })
  @IsOptional()
  @IsString()
  browser: string;

  @ApiProperty({ required: false, description: '登录操作系统' })
  @IsOptional()
  @IsString()
  os: string;
}
