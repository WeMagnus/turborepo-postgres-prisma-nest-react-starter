import { Controller, Get, Post } from '@nestjs/common';
import { parseCounterResponse, type CounterResponse } from '@repo/contracts';
import { CounterService } from './counter.service';

@Controller('counter')
export class CounterController {
  constructor(private readonly counterService: CounterService) {}

  @Get()
  async getCounter(): Promise<CounterResponse> {
    return parseCounterResponse({
      value: await this.counterService.getValue(),
    });
  }

  @Post('increment')
  async increment(): Promise<CounterResponse> {
    return parseCounterResponse({
      value: await this.counterService.increment(),
    });
  }

  @Post('decrement')
  async decrement(): Promise<CounterResponse> {
    return parseCounterResponse({
      value: await this.counterService.decrement(),
    });
  }

  @Post('reset')
  async reset(): Promise<CounterResponse> {
    return parseCounterResponse({
      value: await this.counterService.reset(),
    });
  }
}
