export type ValidatedEnvironment = {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  REDIS_URL?: string;
  CORS_ORIGIN?: string;
};

function requireValue(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parsePort(value: string | undefined): number {
  const port = Number(value ?? '3000');

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid TCP port number.');
  }

  return port;
}

function parseNodeEnv(value: string | undefined): ValidatedEnvironment['NODE_ENV'] {
  const nodeEnv = value ?? 'development';

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }

  return nodeEnv as ValidatedEnvironment['NODE_ENV'];
}

export function validateEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): ValidatedEnvironment {
  const NODE_ENV = parseNodeEnv(env.NODE_ENV);

  const DATABASE_URL = requireValue('DATABASE_URL', env.DATABASE_URL);
  const JWT_SECRET = requireValue('JWT_SECRET', env.JWT_SECRET);
  const REFRESH_TOKEN_SECRET = requireValue(
    'REFRESH_TOKEN_SECRET',
    env.REFRESH_TOKEN_SECRET,
  );

  if (NODE_ENV === 'production' && JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production.');
  }

  if (NODE_ENV === 'production' && REFRESH_TOKEN_SECRET.length < 32) {
    throw new Error(
      'REFRESH_TOKEN_SECRET must be at least 32 characters in production.',
    );
  }

  if (JWT_SECRET === REFRESH_TOKEN_SECRET) {
    throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be different.');
  }

  return {
    NODE_ENV,
    PORT: parsePort(env.PORT),
    DATABASE_URL,
    JWT_SECRET,
    REFRESH_TOKEN_SECRET,
    REDIS_URL: env.REDIS_URL,
    CORS_ORIGIN: env.CORS_ORIGIN,
  };
}
