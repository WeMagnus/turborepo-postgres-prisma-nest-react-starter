import { Controller, Get } from '@nestjs/common';
import {
  HealthService,
  type HealthResponse,
  type ReadinessResponse,
} from './health.service';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  getHealth(): HealthResponse {
    return this.healthService.getHealth();
  }

  @Get('ready')
  getReadiness(): Promise<ReadinessResponse> {
    return this.healthService.getReadiness();
  }
}
