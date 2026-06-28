import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const objectValue = value as Record<string, unknown>;
  const sortedKeys = Object.keys(objectValue).sort();

  return `{${sortedKeys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(objectValue[key])}`)
    .join(',')}}`;
}

function createAuditHash(data: Record<string, unknown>) {
  return createHash('sha256').update(stableStringify(data)).digest('hex');
}

function getClientIp(request: Request) {
  return (
    request.ip ||
    request.headers['x-forwarded-for']?.toString() ||
    request.socket.remoteAddress ||
    'unknown'
  );
}

function getEntityType(path: string) {
  const cleanPath = path.split('?')[0];
  const parts = cleanPath.split('/').filter(Boolean);

  if (parts.length === 0) {
    return 'system';
  }

  return parts[0];
}

function shouldAudit(method: string, path: string) {
  const auditableMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!auditableMethods.includes(method.toUpperCase())) {
    return false;
  }

  if (path.startsWith('/audit-logs')) {
    return false;
  }

  return true;
}

export function auditLogMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const startedAt = Date.now();

  response.on('finish', async () => {
    try {
      const method = request.method.toUpperCase();
      const path = request.originalUrl || request.url;

      if (!shouldAudit(method, path)) {
        return;
      }

      const user = (request as any).user;
      const entityType = getEntityType(path);

      const previousAuditLog = await prisma.auditLog.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

      const previousHash = previousAuditLog?.currentHash || null;

      const metadata = {
        durationMs: Date.now() - startedAt,
        requestBodyKeys:
          request.body && typeof request.body === 'object'
            ? Object.keys(request.body)
            : [],
      };

      const auditData = {
        userId: user?.id || null,
        action: `${method} ${path}`,
        entityType,
        entityId: null,
        method,
        path,
        ipAddress: getClientIp(request),
        userAgent: request.headers['user-agent'] || null,
        statusCode: response.statusCode,
        metadata,
        previousHash,
      };

      const currentHash = createAuditHash(auditData);

      await prisma.auditLog.create({
        data: {
          userId: user?.id || null,
          action: `${method} ${path}`,
          entityType,
          method,
          path,
          ipAddress: getClientIp(request),
          userAgent: request.headers['user-agent'] || null,
          statusCode: response.statusCode,
          metadata,
          previousHash,
          currentHash,
        },
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  });

  next();
}
