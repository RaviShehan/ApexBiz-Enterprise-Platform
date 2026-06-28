import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
          metadata: {
            durationMs: Date.now() - startedAt,
            requestBodyKeys:
              request.body && typeof request.body === 'object'
                ? Object.keys(request.body)
                : [],
          },
        },
      });
    } catch (error) {
      console.error('Audit log failed:', error);
    }
  });

  next();
}
