import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { metricsRegistry } from './metrics-registry';

const logger = new Logger('HTTP');

export function productionObservabilityMiddleware(
  request: any,
  response: any,
  next: () => void,
): void {
  const requestId =
    request.headers['x-request-id'] ||
    request.headers['x-correlation-id'] ||
    randomUUID();

  request.requestId = requestId;
  response.setHeader('x-request-id', requestId);

  const startTime = Date.now();

  response.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const method = request.method || 'UNKNOWN';
    const originalUrl = request.originalUrl || request.url || '/';
    const statusCode = response.statusCode || 0;

    metricsRegistry.recordRequest({
      method,
      path: originalUrl.split('?')[0],
      statusCode,
      durationMs,
    });

    logger.log(
      JSON.stringify({
        requestId,
        method,
        path: originalUrl,
        statusCode,
        durationMs,
        userAgent: request.headers['user-agent'],
        ip: request.ip,
      }),
    );
  });

  next();
}
