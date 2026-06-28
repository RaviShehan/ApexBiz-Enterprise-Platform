import { NextFunction, Request, Response } from 'express';

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const requestStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000;
const GENERAL_LIMIT = 100;
const AUTH_LIMIT = 20;

function getClientIp(request: Request) {
  return (
    request.ip ||
    request.headers['x-forwarded-for']?.toString() ||
    request.socket.remoteAddress ||
    'unknown'
  );
}

export function rateLimitMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const ip = getClientIp(request);
  const path = request.path || request.url;
  const isAuthRoute = path.startsWith('/auth');
  const limit = isAuthRoute ? AUTH_LIMIT : GENERAL_LIMIT;
  const key = `${ip}:${isAuthRoute ? 'auth' : 'general'}`;

  const now = Date.now();
  const existingRecord = requestStore.get(key);

  if (!existingRecord || existingRecord.resetTime < now) {
    requestStore.set(key, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });

    response.setHeader('X-RateLimit-Limit', limit);
    response.setHeader('X-RateLimit-Remaining', limit - 1);

    next();
    return;
  }

  existingRecord.count += 1;

  const remaining = Math.max(limit - existingRecord.count, 0);

  response.setHeader('X-RateLimit-Limit', limit);
  response.setHeader('X-RateLimit-Remaining', remaining);
  response.setHeader(
    'X-RateLimit-Reset',
    Math.ceil(existingRecord.resetTime / 1000),
  );

  if (existingRecord.count > limit) {
    response.status(429).json({
      statusCode: 429,
      message: 'Too many requests. Please try again later.',
      error: 'Too Many Requests',
    });
    return;
  }

  next();
}
