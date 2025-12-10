import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './common/middleware/exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('🚀 Running in', process.env.NODE_ENV, 'mode');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ExceptionFilter());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
  console.log(`🚀 Server is running on port ${process.env.PORT ?? 4000}`);
}
bootstrap();
