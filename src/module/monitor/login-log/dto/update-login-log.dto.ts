import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLoginLogDto } from './create-login-log.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLoginLogDto extends PartialType(CreateLoginLogDto) {
  @ApiProperty({ required: true, description: '登录信息id' })
  @IsNumber()
  @IsNotEmpty({ message: '登录信息id不能为空' })
  id: number;
}
