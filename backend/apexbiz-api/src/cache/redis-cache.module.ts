import { Module } from '@nestjs/common';
import { CacheHealthController } from './cache-health.controller';
import { RedisCacheService } from './redis-cache.service';

@Module({
  controllers: [CacheHealthController],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
