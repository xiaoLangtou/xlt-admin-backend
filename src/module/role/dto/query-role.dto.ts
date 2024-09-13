import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { CustomDto } from '@/common/dto/index.dto';

export class QueryRoleDto extends CustomDto {
  @ApiProperty({ required: false, description: '角色名称' })
  @IsOptional()
  @ValidateIf((o) => o.roleName)
  roleName?: string;

  @ApiProperty({ required: false, description: '角色标识' })
  @IsOptional()
  @ValidateIf((o) => o.roleCode)
  roleCode?: string;

  @ApiProperty({ required: false, description: '是否启用' })
  @IsOptional()
  @ValidateIf((o) => o.isEnable)
  @IsNumberString()
  isEnable?: number;
}

export class RoleMenuDto {
  @ApiProperty({ required: true, description: '角色id' })
  @IsNumber({}, { message: '角色id必须为数字' })
  id: number;

  @ApiProperty({ required: true, description: '菜单id' })
  menus: number[];
}
