import { auditLogMiddleware } from './audit-logs/audit-log.middleware';
import { rateLimitMiddleware } from './security/rate-limit.middleware';
import { securityHeadersMiddleware } from './security/security-headers.middleware';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ApexBiz Enterprise Platform API')
    .setDescription('API documentation for ApexBiz Enterprise Platform including authentication, products, POS sales, inventory, accounting, audit logs, cybersecurity features, refresh tokens, and ML insights.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication')
    .addTag('Products')
    .addTag('POS Sales')
    .addTag('Inventory')
    .addTag('Accounting')
    .addTag('Audit Logs')
    .addTag('Security')
    .addTag('ML Insights')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(port);

  console.log(`ApexBiz API is running on http://localhost:${port}`);
}

bootstrap();

