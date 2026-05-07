import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ReservationRepository } from '../domain/reservation.repository';
import { ReservationStatus } from '../domain/reservation-status.enum';

@Injectable()
export class BoardReservationUseCase {
  constructor(private readonly reservations: ReservationRepository) {}

  async execute(code: string, companyId: string): Promise<void> {
    const reservation = await this.reservations.findByCode(code);
    if (!reservation || reservation.companyId !== companyId) throw new NotFoundException('reservation_not_found');
    if (reservation.status === ReservationStatus.CANCELLED || reservation.status === ReservationStatus.EXPIRED) {
      throw new BadRequestException('reservation_not_active');
    }
    reservation.status = ReservationStatus.BOARDED;
    await this.reservations.save(reservation);
  }
}
