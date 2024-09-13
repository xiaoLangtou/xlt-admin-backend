import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@/common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'menu',
  comment: '菜单权限表',
})
export class Menu extends CommonEntity {
  @ApiProperty({ type: Number, description: '菜单ID' })
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '菜单ID',
  })
  id: number;

  @ApiProperty({ type: String, description: '菜单名称' })
  @Column({
    type: 'varchar',
    name: 'name',
    nullable: true,
    comment: '菜单名称',
  })
  name: string;

  @ApiProperty({ type: String, description: '英文名称' })
  @Column({
    name: 'en_name',
    nullable: true,
    comment: '英文名称',
  })
  enName: string;

  @ApiProperty({ type: String, description: '权限表示' })
  @Column({
    comment: '权限表示',
    nullable: true,
  })
  permission: string;

  @ApiProperty({ type: String, description: '路由路径' })
  @Column({
    comment: '路由路径',
    nullable: true,
  })
  path: string;

  @ApiProperty({ type: Number, description: '父ID' })
  @Column({
    comment: '父ID',
    type: 'bigint',
    nullable: true,
    name: 'parent_menu_id',
  })
  parentMenuId: number;

  @ApiProperty({ type: String, description: '菜单图标' })
  @Column({
    comment: '菜单图标',
    nullable: true,
  })
  icon: string;

  @ApiProperty({ type: String, description: '是否显示' })
  @Column({
    type: 'char',
    default: '1',
    comment: '是否显示 0:不可见 1:可见',
  })
  visible: string;

  @ApiProperty({ type: Number, description: '排序值' })
  @Column({
    name: 'sort_order',
    nullable: true,
    comment: '排序值',
  })
  sortOrder: number;

  @ApiProperty({ type: String, description: '是否缓存' })
  @Column({
    type: 'char',
    name: 'keep_alive',
    default: '0',
    nullable: true,
    comment: '是否缓存 0:不缓存 1:缓存',
  })
  keepAlive: string;

  @ApiProperty({ type: String, description: '是否内嵌' })
  @Column({
    type: 'char',
    nullable: true,
    comment: '是否内嵌 0:不内嵌 1:内嵌',
  })
  embedded: string;

  @ApiProperty({ type: String, description: '菜单类型' })
  @Column({
    type: 'char',
    name: 'menu_type',
    default: '0',
    comment: '菜单类型 0:目录 1:菜单 2:按钮',
  })
  menuType: number;

  @ApiProperty({ type: String, description: '是否外链' })
  @Column({
    comment: '是否外链 0:不是 1:是',
    name: 'is_iframe',
    default: '0',
  })
  isIframe: string;

  @ApiProperty({ type: String, description: '外链地址' })
  @Column({
    comment: '外链地址',
    name: 'iframe_url',
    nullable: true,
  })
  iframeUrl: string;

  @ApiProperty({ type: String, description: '组件路径' })
  @Column({
    comment: '组件路径',
    nullable: true,
  })
  component: string;
}
