import { NestFactory } from '@nestjs/core';
import { ApiErrorFilter } from './app/api-error.filter.js';
import { AppModule } from './app/app.module.js';
import { env } from './shared/config/index.js';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  // Все маршруты API начинаются с /api — фронтенд проксирует их через Vite
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ApiErrorFilter());
  await app.listen(env.port);
};

await bootstrap();
