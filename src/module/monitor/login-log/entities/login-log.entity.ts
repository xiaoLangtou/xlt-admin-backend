import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '@/common/entities/base.entity';

@Entity({
  name: 'login_log',
  comment: '登录日志',
})
export class LoginLog extends CommonEntity {
  @PrimaryGeneratedColumn({ comment: '访问ID' })
  id: number;

  @Column({ type: 'varchar', length: 50, comment: '登录用户名', nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 50, comment: '登录IP', nullable: true })
  ipaddr: string;

  @Column({ type: 'varchar', length: 50, comment: '登录地点', nullable: true })
  loginLocation: string;

  @Column({ type: 'timestamp', comment: '登录时间', nullable: true })
  loginTime: Date;

  @Column({ type: 'varchar', length: 50, comment: '浏览器类型', nullable: true })
  browser: string;

  @Column({ type: 'varchar', length: 50, comment: '操作系统', nullable: true })
  os: string;

  @Column({ type: 'varchar', length: 50, comment: '登录状态（0成功 1失败）', nullable: true })
  status: string;

  @Column({ type: 'varchar', name: 'msg', length: 255, nullable: true, comment: '提示消息' })
  msg: string;
}
