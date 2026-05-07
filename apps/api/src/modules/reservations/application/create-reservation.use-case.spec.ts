import { BadRequestException } from '@nestjs/common';
import { CreateReservationUseCase } from './create-reservation.use-case';
import { ReservationStatus } from '../domain/reservation-status.enum';

const COMPANY_ID = 'company-1';
const SCHEDULE_ID = 'schedule-1';

function makeSchedule(overrides: Partial<{
  active: boolean;
  capacity: number;
  type: string;
  telegramChatId: string | null;
}> = {}) {
  return {
    id: SCHEDULE_ID,
    companyId: COMPANY_ID,
    active: true,
    departureTime: '08:00',
    price: 50,
    vehicle: { type: 'trufi', capacity: overrides.capacity ?? 10, serviceType: 'normal' },
    route: { origin: 'La Paz', destination: 'Cochabamba' },
    company: { name: 'Empresa Test', telegramChatId: overrides.telegramChatId ?? null },
    ...overrides,
  };
}

function makePrisma(schedule: unknown, reservedQty = 0, createdRow: unknown = null) {
  const row = createdRow ?? {
    id: 'res-1', code: 'ABCD1234', scheduleId: SCHEDULE_ID, companyId: COMPANY_ID,
    passengerName: 'Juan', passengerPhone: '+591700', quantity: 1,
    status: 'pending_payment', expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  };
  return {
    schedule: { findUnique: jest.fn().mockResolvedValue(schedule) },
    reservation: {
      aggregate: jest.fn().mockResolvedValue({ _sum: { quantity: reservedQty } }),
      create: jest.fn().mockResolvedValue(row),
    },
    seatReservation: { createMany: jest.fn().mockResolvedValue({ count: 0 }) },
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
  passengerName: 'Juan',
  passengerPhone: '+591700',
  quantity: 1,
  paymentMethod: 'bank_transfer' as const,
  travelDate: '2026-05-10',
};

describe('CreateReservationUseCase', () => {
  const repo = { save: jest.fn(), findByCode: jest.fn(), findByCodeAndPhone: jest.fn(), findByCompany: jest.fn(), countActiveBySchedule: jest.fn() };
  const telegram = { sendReservationNotification: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => jest.clearAllMocks());

  it('creates a reservation successfully', async () => {
    const prisma = makePrisma(makeSchedule());
    const useCase = new CreateReservationUseCase(repo as never, prisma as never, telegram as never);

    const result = await useCase.execute(baseInput);

    expect(result.reservation).toBeDefined();
    expect(result.reservation.status).toBe(ReservationStatus.PENDING);
    expect(result.scheduleInfo.origin).toBe('La Paz');
    expect(result.scheduleInfo.destination).toBe('Cochabamba');
  });

  it('throws BadRequestException when schedule does not exist', async () => {
    const prisma = makePrisma(null);
    const useCase = new CreateReservationUseCase(repo as never, prisma as never, telegram as never);

    await expect(useCase.execute(baseInput)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when schedule is inactive', async () => {
    const prisma = makePrisma(makeSchedule({ active: false }));
    const useCase = new CreateReservationUseCase(repo as never, prisma as never, telegram as never);

    await expect(useCase.execute(baseInput)).rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when capacity is insufficient', async () => {
    // Capacity = 10, already reserved = 9, requesting 2 → insufficient
    const prisma = makePrisma(makeSchedule({ capacity: 10 }), 9);
    const useCase = new CreateReservationUseCase(repo as never, prisma as never, telegram as never);

    await expect(useCase.execute({ ...baseInput, quantity: 2 })).rejects.toThrow(BadRequestException);
  });

  it('allows reservation when exactly enough capacity remains', async () => {
    // Capacity = 10, already reserved = 8, requesting 2 → exactly enough
    const prisma = makePrisma(makeSchedule({ capacity: 10 }), 8);
    const useCase = new CreateReservationUseCase(repo as never, prisma as never, telegram as never);

    const result = await useCase.execute({ ...baseInput, quantity: 2 });

    expect(result.reservation).toBeDefined();
  });

  it('sets status to pending when proofImageUrl is provided', async () => {
    const row = {
      id: 'res-1', code: 'ABCD1234', scheduleId: SCHEDULE_ID, companyId: COMPANY_ID,
      passengerName: 'Juan', passengerPhone: '+591700', quantity: 1,
      status: 'pending', expiresAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
    };
    const prisma = makePrisma(makeSchedule(), 0, row);
    const useCase = new CreateReservationUseCase(repo as never, prisma as never, telegram as never);

    const result = await useCase.execute({ ...baseInput, proofImageUrl: 'https://example.com/proof.jpg' });

    expect(result.reservation.status).toBe(ReservationStatus.PENDING);
  });

  it('does not throw when Telegram notification fails', async () => {
    const telegramFailing = { sendReservationNotification: jest.fn().mockRejectedValue(new Error('Telegram down')) };
    const prisma = makePrisma(makeSchedule({ telegramChatId: '12345' }));
    const useCase = new CreateReservationUseCase(repo as never, prisma as never, telegramFailing as never);

    await expect(useCase.execute(baseInput)).resolves.toBeDefined();
  });
});
