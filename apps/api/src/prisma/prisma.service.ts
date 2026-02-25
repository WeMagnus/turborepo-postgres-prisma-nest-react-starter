import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@repo/db';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ServerEnv } from '@repo/env';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService<ServerEnv>) {
    super({
      adapter: new PrismaPg({
        connectionString: config.getOrThrow('DATABASE_URL', { infer: true }),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
