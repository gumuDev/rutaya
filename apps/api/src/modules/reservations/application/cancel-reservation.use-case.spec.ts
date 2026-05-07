import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CancelReservationUseCase } from './cancel-reservation.use-case';
import { Reservation } from '../domain/reservation.entity';
import { ReservationStatus } from '../domain/reservation-status.enum';

function makeReservation(status = ReservationStatus.PENDING): Reservation {
  const r = new Reservation(
    'res-1', 'CODE1234', 'schedule-1', 'company-1',
    'Juan Pérez', '+59170000000', 1,
    status,
    new Date(), new Date(), new Date(Date.now() + 30 * 60 * 1000),
  );
  return r;
}

function makeRepo(reservation: Reservation | null = null) {
  return {
    findByCode: jest.fn().mockResolvedValue(reservation),
    save: jest.fn().mockResolvedValue(reservation),
    findByCodeAndPhone: jest.fn(),
    findByCompany: jest.fn(),
    countActiveBySchedule: jest.fn(),
  };
}

describe('CancelReservationUseCase', () => {
  it('cancels a pending reservation', async () => {
    const reservation = makeReservation(ReservationStatus.PENDING);
    const repo = makeRepo(reservation);
    const useCase = new CancelReservationUseCase(repo as never);

    await useCase.execute('CODE1234', 'company-1');

    expect(reservation.status).toBe(ReservationStatus.CANCELLED);
    expect(repo.save).toHaveBeenCalledWith(reservation);
  });

  it('cancels a confirmed reservation', async () => {
    const reservation = makeReservation(ReservationStatus.CONFIRMED);
    const repo = makeRepo(reservation);
    const useCase = new CancelReservationUseCase(repo as never);

    await useCase.execute('CODE1234', 'company-1');

    expect(reservation.status).toBe(ReservationStatus.CANCELLED);
  });

  it('throws NotFoundException when reservation does not exist', async () => {
    const repo = makeRepo(null);
    const useCase = new CancelReservationUseCase(repo as never);

    await expect(useCase.execute('NOTEXIST', 'company-1'))
      .rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when reservation belongs to another company', async () => {
    const reservation = makeReservation();
    const repo = makeRepo(reservation);
    const useCase = new CancelReservationUseCase(repo as never);

    await expect(useCase.execute('CODE1234', 'other-company'))
      .rejects.toThrow(NotFoundException);
  });

  it('throws BadRequestException when reservation is already cancelled', async () => {
    const reservation = makeReservation(ReservationStatus.CANCELLED);
    const repo = makeRepo(reservation);
    const useCase = new CancelReservationUseCase(repo as never);

    await expect(useCase.execute('CODE1234', 'company-1'))
      .rejects.toThrow(BadRequestException);
  });

  it('throws BadRequestException when reservation is already boarded', async () => {
    const reservation = makeReservation(ReservationStatus.BOARDED);
    const repo = makeRepo(reservation);
    const useCase = new CancelReservationUseCase(repo as never);

    await expect(useCase.execute('CODE1234', 'company-1'))
      .rejects.toThrow(BadRequestException);
  });
});
