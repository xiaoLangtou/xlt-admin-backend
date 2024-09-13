import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ required: true, description: '菜单ID' })
  @IsNotEmpty({ message: '菜单ID不能为空' })
  id: number;
}
