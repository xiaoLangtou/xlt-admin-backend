import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key as any);
  }

  async set(key: string, value: any, ttl?: number) {
    await this.redisClient.set(key as any, value);
    if (ttl) {
      await this.redisClient.expire(key as any, ttl as any);
    }
  }

  del(key: string) {
    this.redisClient.del(key as any);
  }
}
