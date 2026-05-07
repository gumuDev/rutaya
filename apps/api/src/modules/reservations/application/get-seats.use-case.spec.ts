import { NotFoundException } from '@nestjs/common';
import { GetSeatsUseCase } from './get-seats.use-case';

function makePrisma(schedule: unknown = null, takenSeats: { seatNumber: number }[] = []) {
  return {
    schedule: {
      findUnique: jest.fn().mockResolvedValue(schedule),
    },
    seatReservation: {
      findMany: jest.fn().mockResolvedValue(takenSeats),
    },
  };
}

const busSchedule = {
  id: 'sched-1',
  vehicle: { type: 'bus', serviceType: 'normal', capacity: 40 },
};

const truffiSchedule = {
  id: 'sched-2',
  vehicle: { type: 'trufi', serviceType: 'normal', capacity: 4 },
};

describe('GetSeatsUseCase', () => {
  it('throws NotFoundException when schedule does not exist', async () => {
    const prisma = makePrisma(null);
    const useCase = new GetSeatsUseCase(prisma as never);

    await expect(useCase.execute('nonexistent', '2026-05-10'))
      .rejects.toThrow(NotFoundException);
  });

  it('returns empty takenSeats for non-bus vehicles without querying seatReservations', async () => {
    const prisma = makePrisma(truffiSchedule);
    const useCase = new GetSeatsUseCase(prisma as never);

    const result = await useCase.execute('sched-2', '2026-05-10');

    expect(result.takenSeats).toEqual([]);
    expect(result.vehicleType).toBe('trufi');
    expect(prisma.seatReservation.findMany).not.toHaveBeenCalled();
  });

  it('returns taken seat numbers for bus vehicles', async () => {
    const prisma = makePrisma(busSchedule, [{ seatNumber: 3 }, { seatNumber: 7 }]);
    const useCase = new GetSeatsUseCase(prisma as never);

    const result = await useCase.execute('sched-1', '2026-05-10');

    expect(result.takenSeats).toEqual([3, 7]);
    expect(result.vehicleType).toBe('bus');
    expect(result.capacity).toBe(40);
  });

  it('returns empty takenSeats when no seats are reserved on that date', async () => {
    const prisma = makePrisma(busSchedule, []);
    const useCase = new GetSeatsUseCase(prisma as never);

    const result = await useCase.execute('sched-1', '2026-05-10');

    expect(result.takenSeats).toEqual([]);
  });

  it('queries seatReservations only for active statuses', async () => {
    const prisma = makePrisma(busSchedule, []);
    const useCase = new GetSeatsUseCase(prisma as never);

    await useCase.execute('sched-1', '2026-05-10');

    expect(prisma.seatReservation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          reservation: { status: { in: ['pending_payment', 'pending', 'confirmed'] } },
        }),
      }),
    );
  });
});
