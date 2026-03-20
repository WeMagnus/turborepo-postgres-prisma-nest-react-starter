import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  const healthService = {
    getHealth: jest.fn(),
    getReadiness: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: healthService,
        },
      ],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  it('should return health status', () => {
    healthService.getHealth.mockReturnValue({ status: 'ok' });

    expect(healthController.getHealth()).toEqual({ status: 'ok' });
    expect(healthService.getHealth).toHaveBeenCalledTimes(1);
  });

  it('should return readiness status', async () => {
    healthService.getReadiness.mockResolvedValue({
      status: 'ok',
      database: 'up',
    });

    await expect(healthController.getReadiness()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
    expect(healthService.getReadiness).toHaveBeenCalledTimes(1);
  });
});
