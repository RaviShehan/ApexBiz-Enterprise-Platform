import { Controller, Get } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';

@Controller('cache')
export class CacheHealthController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  @Get('health')
  async health() {
    const available = await this.redisCacheService.isAvailable();

    return {
      service: 'redis-cache',
      status: available ? 'available' : 'unavailable',
      configured: Boolean(process.env.REDIS_URL),
      timestamp: new Date().toISOString(),
    };
  }
}
