import { ExpireReservationsUseCase } from './expire-reservations.use-case';

function makePrisma(count = 0) {
  return {
    reservation: {
      updateMany: jest.fn().mockResolvedValue({ count }),
    },
  };
}

describe('ExpireReservationsUseCase', () => {
  it('expires pending_payment and pending reservations past their expiresAt', async () => {
    const prisma = makePrisma(3);
    const useCase = new ExpireReservationsUseCase(prisma as never);

    const result = await useCase.execute();

    expect(result).toBe(3);
    expect(prisma.reservation.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { in: ['pending_payment', 'pending'] },
        }),
        data: expect.objectContaining({ status: 'expired' }),
      }),
    );
  });

  it('returns 0 when no reservations are expired', async () => {
    const prisma = makePrisma(0);
    const useCase = new ExpireReservationsUseCase(prisma as never);

    const result = await useCase.execute();

    expect(result).toBe(0);
  });

  it('passes a date lte filter to catch all past expirations', async () => {
    const prisma = makePrisma(1);
    const useCase = new ExpireReservationsUseCase(prisma as never);
    const before = new Date();

    await useCase.execute();

    const after = new Date();
    const callArgs = prisma.reservation.updateMany.mock.calls[0][0];
    const lteDate: Date = callArgs.where.expiresAt.lte;

    expect(lteDate.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(lteDate.getTime()).toBeLessThanOrEqual(after.getTime());
  });
});
