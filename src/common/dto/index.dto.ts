import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumberString, IsOptional, ValidateIf } from 'class-validator';

export class PagerParamsDto {
  @ApiPropertyOptional({ description: '当前页' })
  @IsOptional()
  @IsNumberString()
  current?: number;

  @ApiPropertyOptional({ description: '每页条数' })
  @IsOptional()
  @IsNumberString()
  size?: number;
}

export class CustomDto extends PagerParamsDto {
  @ApiPropertyOptional({ description: '开始时间' })
  @IsOptional()
  @ValidateIf((o) => o.startTime)
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间' })
  @ValidateIf((o) => o.endTime)
  @IsDateString()
  @IsOptional()
  endTime?: string;
}
