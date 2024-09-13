import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from '@/common/entities/base.entity';
import { Menu } from '@/module/menu/entities/menu.entity';
import { STATUS_ENUM } from '@/common/enums';
import { User } from '@/module/user/entities/user.entity';

@Entity({
  name: 'roles',
})
export class Role extends CommonEntity {
  @PrimaryGeneratedColumn({
    comment: '角色id',
  })
  id: number;

  @Column({
    comment: '角色名',
    length: 50,
  })
  name: string;

  @Column({
    comment: '角色标识',
    name: 'role_code',
  })
  roleCode: string;

  @Column({
    comment: '角色描述',
    length: 50,
    nullable: true,
  })
  description: string;

  @Column({
    comment: '是否启用',
    name: 'is_enable',
    type: 'enum',
    enum: STATUS_ENUM,
    default: STATUS_ENUM.ENABLE,
  })
  isEnable: number;

  @Column({
    comment: '排序',
    name: 'sort_order',
    default: 0,
  })
  sortOrder: number;

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'role_menus',
  })
  menus: Menu[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
