import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservationRepository } from '../domain/reservation.repository';
import { ReservationStatus } from '../domain/reservation-status.enum';

@Injectable()
export class ConfirmReservationUseCase {
  constructor(private readonly reservations: ReservationRepository) {}

  async execute(code: string, companyId: string): Promise<void> {
    const reservation = await this.reservations.findByCode(code);
    if (!reservation || reservation.companyId !== companyId) throw new NotFoundException('reservation_not_found');
    if (reservation.status !== ReservationStatus.PENDING) throw new BadRequestException('reservation_not_pending');
    reservation.status = ReservationStatus.CONFIRMED;
    await this.reservations.save(reservation);
  }
}
