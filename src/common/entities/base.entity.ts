import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  UpdateDateColumn,
} from 'typeorm';
import { DEL_FLAG } from '@/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export abstract class CommonEntity {
  @ApiProperty({ type: String, description: '删除标识 0:未删除 1:已删除' })
  @Column({
    name: 'del_flag',
    type: 'enum',
    default: '0',
    enum: DEL_FLAG,
    comment: '删除标识 0:未删除 1:已删除',
  })
  @Index()
  delFlag: string;

  @ApiProperty({ type: Date, description: '创建时间' })
  @CreateDateColumn({
    type: 'datetime',
    name: 'create_time',
    nullable: true,
    comment: '创建时间',
  })
  createTime: Date;

  @ApiProperty({ type: String, description: '创建人' })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'create_by',
    nullable: true,
    comment: '创建人',
  })
  createBy: string;

  @ApiProperty({ type: Date, description: '更新时间' })
  @UpdateDateColumn({
    name: 'update_time',
    nullable: true,
    type: 'datetime',
    comment: '更新时间',
  })
  updateTime: Date;

  @ApiProperty({ type: String, description: '更新人' })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'update_by',
    nullable: true,
    comment: '更新人',
  })
  updateBy: string;

  @ApiProperty({ type: String, description: '删除时间' })
  @DeleteDateColumn({
    type: 'datetime',
    name: 'delete_time',
    nullable: true,
    comment: '删除时间',
  })
  deleteTime: Date;

  @ApiProperty({ type: String, description: '删除人' })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'delete_by',
    nullable: true,
    comment: '删除人',
  })
  deleteBy: string;

  @ApiProperty({ type: String, description: '备注' })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '备注',
  })
  remark: string;
}
