import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import type { EnvConfig } from './config/env.validation';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = app.get(ConfigService<EnvConfig, true>);

  const allowedOrigins = (
    config.get('CORS_ORIGINS', { infer: true }) ?? 'http://localhost:3000'
  )
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({ origin: allowedOrigins, credentials: true });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      // Strip properties not in DTO — prevents mass-assignment attacks
      whitelist: true,
      // Auto-transform payloads to DTO class instances
      transform: true,
      // Reject requests with unknown properties outright
      forbidNonWhitelisted: true,
    }),
  );

  // Every error leaves through here, in the shape documented in CLAUDE.md:
  // { code, message, details }. Without it a dropped database connection and
  // a malformed body both reach the client as a bare "Internal server error".
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nonsololarco API')
    .setDescription('API for Nonsololarco')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get('PORT', { infer: true }) ?? 3001;

  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
