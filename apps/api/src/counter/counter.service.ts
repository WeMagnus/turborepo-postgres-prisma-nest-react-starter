import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CounterService {
  private static readonly COUNTER_ID = 'global';

  constructor(private readonly prisma: PrismaService) {}

  async getValue(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { id: CounterService.COUNTER_ID },
      update: {},
      create: { id: CounterService.COUNTER_ID, value: 0 },
    });

    return state.value;
  }

  async increment(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { id: CounterService.COUNTER_ID },
      update: { value: { increment: 1 } },
      create: { id: CounterService.COUNTER_ID, value: 1 },
    });

    return state.value;
  }

  async decrement(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { id: CounterService.COUNTER_ID },
      update: { value: { decrement: 1 } },
      create: { id: CounterService.COUNTER_ID, value: -1 },
    });

    return state.value;
  }

  async reset(): Promise<number> {
    const state = await this.prisma.counterState.upsert({
      where: { id: CounterService.COUNTER_ID },
      update: { value: 0 },
      create: { id: CounterService.COUNTER_ID, value: 0 },
    });

    return state.value;
  }
}
