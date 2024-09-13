import { Global, Module } from '@nestjs/common';
import { RedisService } from '@/module/redis/redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redis = createClient({
          socket: {
            host: configService.get('db.redis.host'),
            port: configService.get('db.redis.port'),
          },
          database: configService.get('db.redis.database'),
        });
        await redis.connect();
        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
