import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ required: true, description: '菜单类型' })
  @IsNotEmpty({ message: '菜单类型不能为空' })
  menuType: number;

  @ApiProperty({ required: true, description: '菜单名称' })
  @IsNotEmpty({ message: '菜单名称不能为空' })
  name: string;

  @ApiProperty({ required: true, description: '前端名称' })
  @IsOptional()
  enName: string;

  @ApiProperty({ required: true, description: '父ID' })
  @IsNotEmpty({ message: '父ID不能为空' })
  parentId: number;

  @ApiProperty({ required: true, description: '权限标识' })
  @IsNotEmpty({ message: '权限标识不能为空' })
  @ValidateIf((o) => ![0].includes(o.menuType))
  permission: string;

  @ApiProperty({ required: true, description: '路径' })
  @IsNotEmpty({ message: '路径不能为空' })
  @ValidateIf((o) => ![2].includes(o.menuType))
  @IsOptional()
  path: string;

  @ApiProperty({ required: true, description: '组件路径' })
  @IsNotEmpty({ message: '组件路径不能为空' })
  @ValidateIf((o) => ![0, 2].includes(o.menuType))
  @IsOptional()
  component: string;

  @ApiProperty({ required: true, description: '图标' })
  @IsOptional()
  icon: string;

  @ApiProperty({ required: true, description: '是否内嵌页面' })
  @IsOptional()
  isIframe: boolean;

  @ApiProperty({ required: true, description: '是否隐藏' })
  @IsOptional()
  isHide: boolean;

  @ApiProperty({ required: true, description: '排序' })
  @IsOptional()
  sortOrder: number;

  @ApiProperty({ required: true, description: '是否缓存' })
  @IsOptional()
  isKeepAlive: boolean;
}
