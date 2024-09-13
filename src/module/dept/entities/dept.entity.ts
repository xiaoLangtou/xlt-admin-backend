import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '@/common/entities/base.entity';
import { DEPT_TYPE, STATUS_ENUM } from '@/common/enums';
import { User } from '@/module/user/entities/user.entity';

@Entity({
  comment: '部门表',
})
export class Dept extends CommonEntity {
  @ApiProperty({ type: Number, description: '部门ID' })
  @PrimaryGeneratedColumn('increment', {
    comment: '部门ID',
  })
  id: number;

  @ApiProperty({ type: String, description: '部门名称' })
  @Column({ name: 'dept_name', comment: '部门名称', length: 100 })
  deptName: string;

  @ApiProperty({ type: String, description: '部门编码' })
  @Column({ name: 'dept_code', comment: '部门编码', length: 100 })
  deptCode: string;

  @ApiProperty({ type: String, description: '部门全称' })
  @Column({ name: 'full_name', comment: '部门全称', length: 100 })
  fullName: string;

  @ApiProperty({ type: Number, description: '父级ID' })
  @Column({ name: 'parent_id', comment: '父级ID' })
  parentId: number;

  @ApiProperty({ type: Number, description: '排序' })
  @Column({ name: 'order_num', comment: '排序' })
  orderNum: number;

  @ApiProperty({ type: String, description: '机构类型' })
  @Column({
    type: 'enum',
    enum: DEPT_TYPE,
    name: 'dept_type',
    comment: '机构类型',
  })
  deptType: string;

  @ApiProperty({ type: String, description: '负责人' })
  @Column({ name: 'leader', comment: '负责人', nullable: true, length: 100 })
  leader: string;

  @ApiProperty({ type: String, description: '联系电话' })
  @Column({ name: 'phone', comment: '联系电话', nullable: true, length: 100 })
  phone: string;

  @ApiProperty({ type: String, description: '邮箱' })
  @Column({ name: 'email', comment: '邮箱', nullable: true, length: 100 })
  email: string;

  @ApiProperty({ type: String, description: '状态' })
  @Column({
    type: 'enum',
    enum: STATUS_ENUM,
    default: STATUS_ENUM.ENABLE,
    name: 'status',
    comment: '状态',
  })
  status: number;

  @ApiProperty({ type: String, description: '邮政编码' })
  @Column({
    name: 'postal_code',
    comment: '邮政编码',
    nullable: true,
    length: 100,
  })
  postalCode: string;

  @ApiProperty({ type: String, description: '地址' })
  @Column({ name: 'address', comment: '地址', nullable: true, length: 100 })
  address: string;

  @ApiProperty({ type: String, description: '备注' })
  @Column({ name: 'remark', comment: '备注', nullable: true, length: 100 })
  remark: string;

  @OneToMany(() => User, (user) => user.dept)
  @JoinTable({
    name: 'user_dept',
    joinColumn: {
      name: 'dept_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
