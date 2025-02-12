import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from '@/common/entities/base.entity';
import { COMMON_STATUS } from '@/common/enums';

@Entity({
  name:"sys_logger",
  comment: '日志表',
})
export class Logger extends CommonEntity {
  @ApiProperty({ type: Number, description: '日志ID' })
  @PrimaryGeneratedColumn({
    comment: '日志ID',
  })
  id: number;

  @ApiProperty({ type: String, description: '日志类型' })
  @Column({
    name: 'log_type',
    comment: '日志类型',
    length: 100,
    nullable: true,
  })
  logType: string;

  @ApiProperty({ type: String, description: '日志内容' })
  @Column({ name: 'log_content', comment: '日志内容', length: 100, nullable: true })
  logContent: string;

  // 请求参数
  @ApiProperty({ type: String, description: '请求参数' })
  @Column({ name: 'request_param', comment: '请求参数', type: 'text', nullable: true })
  requestParam: string;

  // 请求地址
  @ApiProperty({ type: String, description: '请求地址' })
  @Column({ name: 'request_url', type: 'text', comment: '请求地址', nullable: true })
  requestUrl: string;

  // 请求方法
  @ApiProperty({ type: String, description: '请求方法' })
  @Column({ name: 'request_method', comment: '请求方法', length: 100, nullable: true })
  requestMethod: string;

  // 请求IP
  @ApiProperty({ type: String, description: '请求IP' })
  @Column({ name: 'request_ip', comment: '请求IP', length: 100, nullable: true })
  requestIp: string;

  // 请求ip地址
  @ApiProperty({ type: String, description: '请求ip地址' })
  @Column({ name: 'request_ip_addr', comment: '请求ip地址', length: 100, nullable: true })
  requestIpAddr: string;

  // 请求耗时
  @ApiProperty({ type: String, description: '请求耗时' })
  @Column({ name: 'request_time_consume', comment: '请求耗时', length: 100, nullable: true })
  requestTimeConsume: string;

  //浏览器类型
  @ApiProperty({ type: String, description: '浏览器类型' })
  @Column({ name: 'browser', comment: '浏览器类型', length: 100, nullable: true })
  browser: string;

  // 操作系统
  @ApiProperty({ type: String, description: '操作系统' })
  @Column({ name: 'os', comment: '操作系统', length: 100, nullable: true })
  os: string;

  // 所属模块
  @ApiProperty({ type: String, description: '所属模块' })
  @Column({ name: 'module', comment: '所属模块', length: 100, nullable: true })
  module: string;

  // 响应头
  @ApiProperty({ type: String, description: '响应头' })
  @Column({ name: 'response_header', comment: '响应头', type: 'text', nullable: true })
  responseHeader: string;

  // 响应体
  @ApiProperty({ type: String, description: '响应体' })
  @Column({
    name: 'response_body',
    comment: '响应体',
    type: 'text',
    nullable: true,
  })
  responseBody: string;

  // 请求头
  @ApiProperty({ type: String, description: '请求头' })
  @Column({ name: 'request_header', comment: '请求头', type: 'text', nullable: true })
  requestHeader: string;

  // 请求体
  @ApiProperty({ type: String, description: '请求体' })
  @Column({ name: 'request_body', comment: '请求体', type: 'text', nullable: true })
  requestBody: string;

  // 状态
  @ApiProperty({ type: Number, description: '请求状态' })
  @Column({ name: 'status', comment: '状态', type: 'enum', default: COMMON_STATUS.SUCCESS, enum: COMMON_STATUS })
  status: number;
}
