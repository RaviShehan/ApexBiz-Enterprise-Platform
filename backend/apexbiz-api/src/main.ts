import { auditLogMiddleware } from './audit-logs/audit-log.middleware';
import { rateLimitMiddleware } from './security/rate-limit.middleware';
import { securityHeadersMiddleware } from './security/security-headers.middleware';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(securityHeadersMiddleware);
  app.use(rateLimitMiddleware);
  app.use(auditLogMiddleware);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`ApexBiz API is running on http://localhost:${port}`);
}

bootstrap();

