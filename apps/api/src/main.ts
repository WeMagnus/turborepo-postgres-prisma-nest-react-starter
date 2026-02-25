import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import type { ServerEnv } from '@repo/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  app.enableShutdownHooks();
  app.enableCors({ origin: true, credentials: true });

  const config = app.get<ConfigService<ServerEnv>>(ConfigService);
  const port = config.getOrThrow('PORT', { infer: true });

  await app.listen(port);
  console.log(`➜  API:   http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
