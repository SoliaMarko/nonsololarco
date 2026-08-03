import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
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
