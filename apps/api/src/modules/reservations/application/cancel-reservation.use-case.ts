import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservationRepository } from '../domain/reservation.repository';
import { ReservationStatus } from '../domain/reservation-status.enum';

@Injectable()
export class CancelReservationUseCase {
  constructor(private readonly reservations: ReservationRepository) {}

  async execute(code: string, companyId: string): Promise<void> {
    const reservation = await this.reservations.findByCode(code);
    if (!reservation || reservation.companyId !== companyId) {
      throw new NotFoundException('reservation_not_found');
    }
    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException('already_cancelled');
    }
    if (reservation.status === ReservationStatus.BOARDED) {
      throw new BadRequestException('already_boarded');
    }
    reservation.status = ReservationStatus.CANCELLED;
    await this.reservations.save(reservation);
  }
}
