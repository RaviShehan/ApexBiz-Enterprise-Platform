import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);
  private client: Redis | null = null;

  private getRedisUrl(): string | undefined {
    return process.env.REDIS_URL;
  }

  private getClient(): Redis | null {
    const redisUrl = this.getRedisUrl();

    if (!redisUrl) {
      return null;
    }

    if (!this.client) {
      this.client = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });

      this.client.on('error', (error) => {
        this.logger.warn(`Redis cache error: ${error.message}`);
      });
    }

    return this.client;
  }

  async isAvailable(): Promise<boolean> {
    const client = this.getClient();

    if (!client) {
      return false;
    }

    try {
      if (client.status === 'wait') {
        await client.connect();
      }

      const result = await client.ping();

      return result === 'PONG';
    } catch {
      return false;
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const client = this.getClient();

    if (!client) {
      return null;
    }

    try {
      if (client.status === 'wait') {
        await client.connect();
      }

      const value = await client.get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.warn(`Redis get failed for key ${key}: ${(error as Error).message}`);
      return null;
    }
  }

  async setJson(
    key: string,
    value: unknown,
    ttlSeconds = 300,
  ): Promise<void> {
    const client = this.getClient();

    if (!client) {
      return;
    }

    try {
      if (client.status === 'wait') {
        await client.connect();
      }

      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(`Redis set failed for key ${key}: ${(error as Error).message}`);
    }
  }

  async delete(key: string): Promise<void> {
    const client = this.getClient();

    if (!client) {
      return;
    }

    try {
      if (client.status === 'wait') {
        await client.connect();
      }

      await client.del(key);
    } catch (error) {
      this.logger.warn(`Redis delete failed for key ${key}: ${(error as Error).message}`);
    }
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const client = this.getClient();

    if (!client) {
      return;
    }

    try {
      if (client.status === 'wait') {
        await client.connect();
      }

      const keys = await client.keys(pattern);

      if (keys.length > 0) {
        await client.del(...keys);
      }
    } catch (error) {
      this.logger.warn(
        `Redis pattern delete failed for pattern ${pattern}: ${(error as Error).message}`,
      );
    }
  }

  buildKey(parts: Array<string | number | undefined | null>): string {
    return parts.filter((part) => part !== undefined && part !== null).join(':');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.quit();
    }
  }
}
