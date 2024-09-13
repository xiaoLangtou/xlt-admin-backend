import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDictDataDto, CreateDictDto } from './create-dict.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDictDto extends PartialType(CreateDictDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: '字典ID不能为空' })
  @IsNumber({}, { message: '字典ID有误' })
  id: number;
}

export class UpdateDictDataDto extends PartialType(CreateDictDataDto) {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: '字典数据ID不能为空' })
  @IsNumber({}, { message: '字典数据ID有误' })
  id: number;
}
