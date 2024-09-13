import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { PagerParamsDto } from '@/common/dto/index.dto';

export class QueryPostDto extends PagerParamsDto {
  @ApiProperty({ type: String, description: '岗位名称' })
  @IsOptional()
  name: string;

  @ApiProperty({ type: String, description: '岗位编码' })
  @IsOptional()
  code: string;

  @ApiProperty({ type: Number, description: '状态' })
  @IsOptional()
  @ValidateIf((o) => o.status)
  @IsNumberString({}, { message: '状态必须为数字' })
  status: number;
}

export class ChangeStatusDto {
  @ApiProperty({ type: Number, description: '岗位ID' })
  @IsNotEmpty({ message: '岗位ID不能为空' })
  id: number;

  @ApiProperty({ type: Number, description: '状态' })
  @IsNumber({}, { message: '状态必须为数字' })
  status: number;
}
