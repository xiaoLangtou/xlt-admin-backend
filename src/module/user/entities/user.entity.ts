import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { USER_IS_ADMIN, USER_IS_FROZEN } from '@/common/enums';
import { CommonEntity } from '@/common/entities/base.entity';
import { Post } from '@/module/post/entities/post.entity';
import { Dept } from '@/module/dept/entities/dept.entity';
import { Role } from '@/module/role/entities/role.entity';

@Entity({
  name: 'users',
})
export class User extends CommonEntity {
  @PrimaryGeneratedColumn({
    comment: '用户id',
  })
  id: number;

  @Column({
    comment: '用户名',
    length: 50,
  })
  username: string;

  @Column({
    comment: '密码',
    length: 50,
  })
  password: string;

  @Column({
    comment: '昵称',
    length: 50,
  })
  nickname: string;

  @Column({
    comment: '邮箱',
    length: 50,
  })
  email: string;

  @Column({
    name: 'head_pic',
    comment: '头像',
    nullable: true,
    length: 255,
  })
  headPic: string;

  @Column({
    name: 'phone_number',
    comment: '手机号',
    nullable: true,
    length: 11,
  })
  phoneNumber: string;

  @Column({
    name: 'is_frozen',
    comment: '是否冻结 NORMAL:正常 FROZEN:冻结',
    type: 'enum',
    enum: USER_IS_FROZEN,
    default: USER_IS_FROZEN.NORMAL,
  })
  isFrozen: string;

  @Column({
    name: 'is_admin',
    comment: '是否管理员 NO:否 YES:是',
    type: 'enum',
    enum: USER_IS_ADMIN,
    default: USER_IS_ADMIN.YES,
  })
  isAdmin: string;

  @Column({
    comment: '姓名',
    length: 50,
  })
  name: string;

  @Column({
    comment: '性别',
    nullable: true,
  })
  sex: number;

  @Column({
    comment: '工号',
    name: 'job_number',
    nullable: true,
  })
  jobNumber: string;

  // 岗位
  @ManyToMany(() => Post, (post) => post.users)
  posts: Post[];

  @ManyToOne(() => Dept, (dept) => dept.users)
  dept: Dept;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles', // 中间表的表名
    joinColumn: { name: 'user_id', referencedColumnName: 'id' }, // 指定 user_id
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }, // 指定 role_id
  })
  roles: Role[];
}
