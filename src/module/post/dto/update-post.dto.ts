import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ type: Number, description: '岗位ID' })
  @IsNotEmpty({ message: '岗位ID不能为空' })
  @IsNumber({}, { message: '岗位ID必须为数字' })
  id: number;
}
