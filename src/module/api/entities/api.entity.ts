import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@/common/entities/base.entity';

@Entity({
  name: 'api',
  comment: 'api表',
})
export class Api extends CommonEntity {
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
}
