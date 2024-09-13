import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from '@/common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  comment: '字典数据表',
})
export class DictData extends CommonEntity {
  @ApiProperty({ type: Number, description: '字典数据ID' })
  @PrimaryGeneratedColumn({
    comment: '字典数据ID',
  })
  id: number;

  @ApiProperty({ type: String, description: '字典值' })
  @Column({
    name: 'dict_value',
    comment: '字典值',
  })
  @Index()
  dictValue: string;

  @ApiProperty({ type: String, description: '字典标签' })
  @Column({
    name: 'dict_label',
    comment: '字典标签',
  })
  @Index()
  dictLabel: string;

  @ApiProperty({ type: String, description: '字典描述' })
  @Column({
    name: 'dict_desc',
    comment: '字典描述',
  })
  dictDesc: string;

  @ApiProperty({ type: String, description: '字典备注' })
  @Column({
    name: 'dict_remark',
    comment: '字典备注',
    nullable: true,
  })
  dictRemark: string;

  @ApiProperty({ type: Number, description: '字典排序' })
  @Column({
    name: 'dict_sort',
    comment: '字典排序',
  })
  dictSort: number;

  @ApiProperty({ type: Number, description: '字典类型ID' })
  @Column({
    name: 'dict_type_id',
  })
  dictTypeId: number;

  @ApiProperty({ type: String, description: '字典类型' })
  @Column({
    name: 'dict_type',
  })
  dictType: string;
}
