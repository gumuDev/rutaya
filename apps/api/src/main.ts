import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Bolivia timezone — set in code since Vercel reserves TZ env var
process.env.TZ = 'America/La_Paz';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      /\.vercel\.app$/,
      process.env.FRONTEND_URL,
    ].filter(Boolean) as (string | RegExp)[],
    credentials: true,
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
