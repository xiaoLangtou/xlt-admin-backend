import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@/common/entities/base.entity';

@Entity({
  name: 'sys_api_ignore',
  comment: 'api忽略表',
})
export class ApiIgnore extends CommonEntity {
  @PrimaryGeneratedColumn({
    comment: '主键id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 191,
    nullable: true,
    comment: 'api路径',
  })
  path: string;

  @Column({
    type: 'varchar',
    length: 191,
    nullable: true,
    comment: 'api描述',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 191,
    nullable: true,
    comment: 'api方法',
  })
  method: string;

  @Column({
    type: 'varchar',
    length: 191,
    nullable: true,
    name: 'api_group',
    comment: 'api组',
  })
  apiGroup: string;


  @Column({
    type: 'bool',
    default: false,
    comment: '是否忽略',
  })
  ignoreFlag: boolean;
}
