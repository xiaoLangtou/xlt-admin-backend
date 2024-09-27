import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async getRedisInfo() {
    // 连接到 Redis 服务器
    const rawInfo = await this.redisClient.info();
    // 按行分割字符串
    const lines = rawInfo.split('\r\n');
    const parsedInfo = {};
    // 遍历每一行并分割键值对
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      parsedInfo[key?.trim()] = value?.trim();
    });
    return parsedInfo;
  }

  /**
   * 获取 Redis 数据库大小
   */
  async getDbSize() {
    return await this.redisClient.dbSize();
  }

  /**
   * 命令统计
   * @returns
   */
  async commandStats() {
    const rawInfo = await this.redisClient.info('commandstats');
    // 按行分割字符串
    const lines = rawInfo.split('\r\n');
    const commandStats = [];
    // 遍历每一行并分割键值对
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        commandStats.push({
          name: key?.trim()?.replaceAll('cmdstat_', ''),
          value: +value?.trim()?.split(',')[0]?.split('=')[1],
        });
      }
    });
    return commandStats;
  }

  /**
   *
   * @param key 存储 key 值
   * @param val key 对应的 val
   * @param ttl 可选，过期时间，单位 毫秒
   */
  async set(key: any, val: any, ttl?: number) {
    const data = JSON.stringify(val) as any;
    if (!ttl) return await this.redisClient.set(key, data);
    return await this.redisClient.set(key, data, 'PX' as any, ttl as any);
  }

  async mGet(keys: string[]): Promise<any[]> {
    if (!keys) return null;
    const list = await this.redisClient.mGet(keys as any);
    return list.map((item) => JSON.parse(item));
  }

  /**
   * 返回对应 value
   * @param key
   */
  async get(key: string): Promise<any> {
    if (!key || key === '*') return null;
    const res = await this.redisClient.get(key as any);
    return JSON.parse(res);
  }

  async del(keys: string | string[]) {
    if (!keys || keys === '*') return 0;
    if (typeof keys === 'string') keys = [keys];
    return await this.redisClient.del(...(keys as any));
  }

  async ttl(key: string) {
    if (!key) return null;
    return await this.redisClient.ttl(key as any);
  }

  /**
   * 获取对象keys
   * @param key
   */
  async keys(key?: string) {
    return await this.redisClient.keys(key as any);
  }

  /* ----------------------- hash ----------------------- */

  /**
   * hash 设置 key 下单个 field value
   * @param key
   * @param field 属性
   * @param value 值
   */
  async hSet(key: string, field: string, value: string): Promise<string | number | null> {
    if (!key || !field) return null;
    return await this.redisClient.hSet(key as any, field as any, value as any);
  }

  /**
   * hash 获取单个 field 的 value
   * @param key
   * @param field
   */
  async hGet(key: string, field: string): Promise<number | string | null> {
    if (!key || !field) return 0;
    return await this.redisClient.hGet(key as any, field as any);
  }

  /**
   * hash 获取 key 下所有field 的 value
   * @param key
   */
  async hVals(key: string) {
    if (!key) return [];
    return await this.redisClient.hVals(key as any);
  }

  async hGetAll(key: string) {
    return await this.redisClient.hGetAll(key as any);
  }

  /**
   * hash 删除 key 下 一个或多个 fields value
   * @param key
   * @param fields
   */
  async hDel(key: string, fields: string | string[]) {
    if (!key || fields.length === 0) return 0;
    return await this.redisClient.hDel(key as any, fields as any);
  }

  /**
   * hash 删除 key 下所有 fields value
   * @param key
   */
  async hDelAll(key: string) {
    if (!key) return 0;
    const fields = await this.redisClient.hKeys(key as any);
    if (fields.length === 0) return 0;
    return await this.hDel(key, fields);
  }

  /* -----------   list 相关操作 ------------------ */

  /**
   * 获取列表长度
   * @param key
   */
  async lLength(key: string) {
    if (!key) return 0;
    return await this.redisClient.lLen(key as any);
  }

  /**
   * 通过索引设置列表元素的值
   * @param key
   * @param index
   * @param val
   */
  async lSet(key: string, index: number, val: string) {
    if (!key || index < 0) return null;
    return await this.redisClient.lSet(key as any, index as any, val as any);
  }

  /**
   * 通过索引获取 列表中的元素
   * @param key
   * @param index
   */
  async lIndex(key: string, index: number) {
    if (!key || index < 0) return null;
    return await this.redisClient.lIndex(key as any, index as any);
  }

  /**
   * 获取列表指定范围内的元素
   * @param key
   * @param start 开始位置， 0 是开始位置
   * @param stop 结束位置， -1 返回所有
   */
  async lRange(key: string, start: number, stop: number) {
    if (!key) return null;
    return await this.redisClient.lRange(key as any, start as any, stop as any);
  }

  /**
   * 将一个或多个值插入到列表头部
   * @param key
   * @param val
   */
  async lLeftPush(key: string, ...val: string[]) {
    if (!key) return 0;
    return await this.redisClient.lPush(key as any, val as any);
  }

  /**
   * 将一个值或多个值插入到已存在的列表头部
   * @param key
   * @param val
   */
  async lLeftPushIfPresent(key: string, ...val: string[]) {
    if (!key) return 0;
    return await this.redisClient.lPushX(key as any, val as any);
  }

  /**
   * 如果 pivot 存在，则在 pivot 前面添加
   * @param key
   * @param pivot
   * @param val
   */
  async lLeftInsert(key: string, pivot: string, val: string): Promise<string | number> {
    if (!key || !pivot) return 0;
    return await this.redisClient.lInsert(key as any, 'BEFORE' as any, pivot as any, val as any);
  }

  /**
   * 如果 pivot 存在，则在 pivot 后面添加
   * @param key
   * @param pivot
   * @param val
   */
  async lRightInsert(key: string, pivot: string, val: string): Promise<number | string> {
    if (!key || !pivot) return 0;
    return await this.redisClient.lInsert(key as any, 'AFTER' as any, pivot as any, val as any);
  }

  /**
   * 在列表中添加一个或多个值
   * @param key
   * @param val
   */
  async lRightPush(key: string, ...val: string[]): Promise<number | string> {
    if (!key) return 0;
    return await this.redisClient.lPush(key as any, val as any);
  }

  /**
   * 为已存在的列表添加一个或多个值
   * @param key
   * @param val
   */
  async lRightPushIfPresent(key: string, ...val: string[]): Promise<string | number> {
    if (!key) return 0;
    return await this.redisClient.rPushX(key as any, val as any);
  }

  /**
   * 移除并获取列表第一个元素
   * @param key
   */
  async lLeftPop(key: string) {
    if (!key) return null;
    return await this.redisClient.blPop(key as any, 100);
  }

  /**
   * 移除并获取列表最后一个元素
   * @param key
   */
  async lRightPop(key: string) {
    if (!key) return null;
    return await this.redisClient.brPop(key as any, 100);
  }

  /**
   * 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除
   * @param key
   * @param start
   * @param stop
   */
  async lTrim(key: string, start: number, stop: number): Promise<string> {
    if (!key) return null;
    return await this.redisClient.lTrim(key as any, start as any, stop as any);
  }

  /**
   * 移除列表元素
   * @param key
   * @param count
   * count > 0 ：从表头开始向表尾搜索，移除与 value 相等的元素，数量为 count；
   * count < 0 ：从表尾开始向表头搜索，移除与 value 相等的元素，数量为 count 的绝对值；
   * count = 0 ： 移除表中所有与 value 相等的值
   * @param val
   */
  async lRemove(key: string, count: number, val: string) {
    if (!key) return 0;
    return await this.redisClient.lRem(key as any, count as any, val as any);
  }

  /**
   * 移除列表最后一个元素，并将该元素添加到另一个裂膏并返回
   * 如果列表没有元素会阻塞队列直到等待超时或发现可弹出元素为止
   * @param sourceKey
   * @param destinationKey
   * @param timeout
   */
  async lPoplPush(sourceKey: string, destinationKey: string, timeout: number): Promise<string> {
    if (!sourceKey || !destinationKey) return null;
    return await this.redisClient.brPopLPush(sourceKey as any, destinationKey as any, timeout as any);
  }

  /**
   * 删除全部缓存
   * @returns
   */
  async reset() {
    return this.redisClient.flushAll();
  }
}
