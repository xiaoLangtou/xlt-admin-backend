import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@/module/redis/redis.service';
import { Result } from '@/common/utils/result';

@Injectable()
export class RedisCacheService {
  @Inject()
  private readonly redisService: RedisService;

  async getRedisInfo() {
    const redisInfo = {
      redis_version: { label: 'redisVersion', description: 'Redis版本' },
      connected_clients: { label: 'connectedClients', description: '客户端数量' },
      uptime_in_days: { label: 'uptimeInDays', description: '已运行天数' },
      used_memory_human: { label: 'usedMemoryHuman', description: '占用内存大小', originalValue: '' },
      used_memory: { label: 'usedMemory', description: '占用内存大小' },
      total_system_memory_human: { label: 'totalSystemMemoryHuman', description: '系统内存大小' },
      loading: { label: 'RDBLoading', description: 'RDB是否载入' },
      aof_enabled: { label: 'AOFEnabled', description: '是否开启AOF' },
    };

    const redisKeys = await this.redisService.getRedisInfo(Object.keys(redisInfo));
    const _redisKeys = Object.keys(redisKeys).reduce((acc, key) => {
      acc[redisInfo[key].label] = {
        value: ['loading', 'aof_enabled'].includes(key) ? { 0: '否', 1: '是' }[redisKeys[key]] : redisKeys[key],
        description: redisInfo[key].description,
        originalValue: key === 'used_memory_human' ? redisKeys['used_memory'] : redisKeys[key],
      };
      return acc;
    }, {});

    // 获取命令统计
    const commands = await this.redisService.commandStats();

    delete _redisKeys['usedMemory'];
    return Result.ok({
      redisInfo: _redisKeys,
      redisCommands: commands,
    });
  }
}
