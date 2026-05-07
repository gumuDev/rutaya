import { BadRequestException } from '@nestjs/common';
import { PosReservationUseCase } from './pos-reservation.use-case';
import { ReservationStatus } from '../domain/reservation-status.enum';

const COMPANY_ID = 'company-1';
const SCHEDULE_ID = 'sched-1';

function makeSchedule(overrides: Partial<{ active: boolean; capacity: number; companyId: string }> = {}) {
  return {
    id: SCHEDULE_ID,
    companyId: overrides.companyId ?? COMPANY_ID,
    active: overrides.active ?? true,
    departureTime: '08:00',
    price: 50,
    vehicle: { type: 'trufi', capacity: overrides.capacity ?? 10 },
    route: { origin: 'La Paz', destination: 'Cochabamba' },
    company: { name: 'Empresa Test', telegramChatId: null },
  };
}

function makePrisma(schedule: unknown, reservedQty = 0) {
  const row = {
    id: 'res-1', code: 'ABCD1234', scheduleId: SCHEDULE_ID, companyId: COMPANY_ID,
    passengerName: 'Juan', passengerPhone: '+591700', quantity: 1,
    status: 'confirmed', expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  };
  return {
    $transaction: jest.fn().mockImplementation((fn: (tx: unknown) => Promise<unknown>) => fn({
      schedule: { findUnique: jest.fn().mockResolvedValue(schedule) },
      reservation: {
        aggregate: jest.fn().mockResolvedValue({ _sum: { quantity: reservedQty } }),
        create: jest.fn().mockResolvedValue(row),
      },
      seatReservation: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
    })),
  };
}

const baseInput = {
  scheduleId: SCHEDULE_ID,
  companyId: COMPANY_ID,
  passengerName: 'Juan',
  passengerPhone: '+591700',
  quantity: 1,
  paymentMethod: 'cash' as const,
  travelDate: '2026-05-10',
};

const repo = { save: jest.fn(), findByCode: jest.fn(), findByCodeAndPhone: jest.fn(), findByCompany: jest.fn(), countActiveBySchedule: jest.fn() };

describe('PosReservationUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a confirmed reservation directly', async () => {
    const prisma = makePrisma(makeSchedule());
    const useCase = new PosReservationUseCase(repo as never, prisma as never);

    const result = await useCase.execute(baseInput);

    expect(result.reservation.status).toBe(ReservationStatus.CONFIRMED);
    expect(result.scheduleInfo.origin).toBe('La Paz');
  });

  it('throws when schedule does not exist', async () => {
    const prisma = makePrisma(null);
    const useCase = new PosReservationUseCase(repo as never, prisma as never);

    await expect(useCase.execute(baseInput)).rejects.toThrow(BadRequestException);
  });

  it('throws when schedule is inactive', async () => {
    const prisma = makePrisma(makeSchedule({ active: false }));
    const useCase = new PosReservationUseCase(repo as never, prisma as never);

    await expect(useCase.execute(baseInput)).rejects.toThrow(BadRequestException);
  });

  it('throws when schedule belongs to another company', async () => {
    const prisma = makePrisma(makeSchedule({ companyId: 'other-company' }));
    const useCase = new PosReservationUseCase(repo as never, prisma as never);

    await expect(useCase.execute(baseInput)).rejects.toThrow(BadRequestException);
  });

  it('throws when capacity is insufficient', async () => {
    const prisma = makePrisma(makeSchedule({ capacity: 5 }), 5);
    const useCase = new PosReservationUseCase(repo as never, prisma as never);

    await expect(useCase.execute(baseInput)).rejects.toThrow(BadRequestException);
  });

  it('accepts cash payment method', async () => {
    const prisma = makePrisma(makeSchedule());
    const useCase = new PosReservationUseCase(repo as never, prisma as never);

    const result = await useCase.execute({ ...baseInput, paymentMethod: 'cash' });
    expect(result.reservation).toBeDefined();
  });

  it('accepts qr payment method', async () => {
    const prisma = makePrisma(makeSchedule());
    const useCase = new PosReservationUseCase(repo as never, prisma as never);

    const result = await useCase.execute({ ...baseInput, paymentMethod: 'qr' });
    expect(result.reservation).toBeDefined();
  });
});
