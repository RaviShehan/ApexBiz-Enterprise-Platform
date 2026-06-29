import { Controller, Get, Header } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { metricsRegistry } from './metrics-registry';

@Controller()
export class ObservabilityController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'apexbiz-api',
      timestamp: new Date().toISOString(),
      endpoints: {
        liveness: '/health/liveness',
        readiness: '/health/readiness',
        metrics: '/metrics',
      },
    };
  }

  @Get('health/liveness')
  liveness() {
    return {
      status: 'alive',
      service: 'apexbiz-api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health/readiness')
  async readiness() {
    const database = await this.checkDatabase();
    const mlService = await this.checkMlService();

    const ready = database.ok && mlService.ok;

    return {
      status: ready ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      checks: {
        database,
        mlService,
      },
    };
  }

  @Get('metrics')
  @Header('Content-Type', 'text/plain')
  metrics() {
    return metricsRegistry.renderPrometheusMetrics();
  }

  private async checkDatabase(): Promise<{ ok: boolean; message: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        ok: true,
        message: 'Database connection is healthy.',
      };
    } catch {
      return {
        ok: false,
        message: 'Database connection failed.',
      };
    }
  }

  private async checkMlService(): Promise<{ ok: boolean; message: string }> {
    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${mlServiceUrl}/health`, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      return {
        ok: response.ok,
        message: response.ok
          ? 'ML service is reachable.'
          : 'ML service returned an unhealthy response.',
      };
    } catch {
      return {
        ok: false,
        message: 'ML service is not reachable.',
      };
    }
  }
}
