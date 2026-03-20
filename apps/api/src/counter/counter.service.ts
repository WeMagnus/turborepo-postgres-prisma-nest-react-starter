import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CounterService {
  private static readonly COUNTER_KEY = 'global';

  constructor(private readonly prisma: PrismaService) {}

  async getValue(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { key: CounterService.COUNTER_KEY },
      update: {},
      create: { key: CounterService.COUNTER_KEY, value: 0 },
    });

    return state.value;
  }

  async increment(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { key: CounterService.COUNTER_KEY },
      update: { value: { increment: 1 } },
      create: { key: CounterService.COUNTER_KEY, value: 1 },
    });

    return state.value;
  }

  async decrement(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { key: CounterService.COUNTER_KEY },
      update: { value: { decrement: 1 } },
      create: { key: CounterService.COUNTER_KEY, value: -1 },
    });

    return state.value;
  }

  async reset(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { key: CounterService.COUNTER_KEY },
      update: { value: 0 },
      create: { key: CounterService.COUNTER_KEY, value: 0 },
    });

    return state.value;
  }
}
