import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@/common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { DICT_SYSTEM_FLAG } from '@/common/enums';

@Entity({
  comment: '字典表',
})
export class Dict extends CommonEntity {
  @ApiProperty({ type: Number, description: '字典ID' })
  @PrimaryGeneratedColumn({
    comment: '字典ID',
  })
  id: number;

  @ApiProperty({ type: String, description: '字典名称' })
  @Column({
    name: 'dict_name',
    comment: '字典名称',
    length: 100,
  })
  dictName: string;

  @ApiProperty({ type: String, description: '字典编码' })
  @Column({
    name: 'dict_code',
    comment: '字典编码',
    length: 100,
  })
  dictCode: string;

  @ApiProperty({ type: String, description: '字典描述' })
  @Column({
    name: 'dict_desc',
    comment: '字典描述',
    length: 100,
  })
  dictDesc: string;

  @ApiProperty({ type: String, description: '系统标识 ' })
  @Column({
    name: 'system_flag',
    type: 'enum',
    enum: DICT_SYSTEM_FLAG,
    default: DICT_SYSTEM_FLAG.BUSINESS,
    comment: '系统标识 SYSTEM_FLAG: BUSINESS-业务字典,SYSTEM-系统字典',
  })
  systemFlag: string;
}
