import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';
import { PrismaService } from './prisma/prisma.service';

describe('HealthService', () => {
  const queryRaw = jest.fn();

  const prisma = {
    $queryRaw: queryRaw,
  } as unknown as PrismaService;

  let healthService: HealthService;

  beforeEach(() => {
    jest.clearAllMocks();
    healthService = new HealthService(prisma);
  });

  it('should report liveness', () => {
    expect(healthService.getHealth()).toEqual({ status: 'ok' });
  });

  it('should report readiness when the database is reachable', async () => {
    queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    await expect(healthService.getReadiness()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it('should return service unavailable when the database is unreachable', async () => {
    queryRaw.mockRejectedValue(new Error('db down'));

    try {
      await healthService.getReadiness();
      throw new Error('Expected readiness check to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(ServiceUnavailableException);
      expect((error as ServiceUnavailableException).getResponse()).toEqual({
        status: 'error',
        database: 'down',
      });
    }
  });
});
