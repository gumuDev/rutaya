import { Reservation } from './reservation.entity';

export abstract class ReservationRepository {
  abstract findByCode(code: string): Promise<Reservation | null>;
  abstract findByCodeAndPhone(code: string, phone: string): Promise<Reservation | null>;
  abstract findByCompany(companyId: string): Promise<Reservation[]>;
  abstract save(reservation: Reservation): Promise<Reservation>;
  abstract countActiveBySchedule(scheduleId: string): Promise<number>;
}
