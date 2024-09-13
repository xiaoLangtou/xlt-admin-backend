import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '@/common/entities/base.entity';
import { STATUS_ENUM } from '@/common/enums';
import { User } from '@/module/user/entities/user.entity';
import { SORT_ORDER } from '@/common/constant';

@Entity({
  name: 'post',
  comment: '岗位表',
})
export class Post extends CommonEntity {
  @ApiProperty({ type: Number, description: '岗位id' })
  @PrimaryGeneratedColumn({
    comment: '岗位id',
  })
  id: number;

  @ApiProperty({ type: String, description: '岗位名称' })
  @Column({
    comment: '岗位名称',
    length: 100,
  })
  name: string;

  @ApiProperty({ type: String, description: '岗位编码' })
  @Column({
    comment: '岗位编码',
    length: 100,
  })
  code: string;

  @ApiProperty({ type: String, description: '岗位描述' })
  @Column({
    comment: '岗位描述',
    length: 100,
    nullable: true,
  })
  description: string;

  @ApiProperty({ type: Number, description: '排序' })
  @Column({
    comment: '排序',
    default: 0,
    name: 'sort_order',
  })
  [SORT_ORDER]: number;

  @ApiProperty({ type: Number, description: '状态' })
  @Column({
    comment: '状态',
    type: 'enum',
    enum: STATUS_ENUM,
    default: STATUS_ENUM.ENABLE,
  })
  status: number;

  @ManyToMany(() => User, (user) => user.posts)
  @JoinTable({
    name: 'user_posts',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
