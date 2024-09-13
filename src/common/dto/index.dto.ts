import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from 'class-validator';

export class PagerParamsDto {
  @ApiProperty({ required: false, description: '当前页' })
  @IsOptional()
  @IsNumberString()
  current?: number;

  @ApiProperty({ required: false, description: '每页条数' })
  @IsOptional()
  @IsNumberString()
  size?: number;
}

export class CustomDto extends PagerParamsDto {
  @ApiProperty({ required: false, description: '开始时间' })
  @IsOptional()
  @ValidateIf((o) => o.startTime)
  @IsDateString()
  startTime?: string;

  @ApiProperty({ required: false, description: '结束时间' })
  @ValidateIf((o) => o.endTime)
  @IsDateString()
  @IsOptional()
  endTime?: string;
}
