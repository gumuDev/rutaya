import { ReservationStatus } from './reservation-status.enum';

export class Reservation {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly scheduleId: string,
    public readonly companyId: string,
    public readonly passengerName: string,
    public readonly passengerPhone: string,
    public readonly quantity: number,
    public status: ReservationStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly expiresAt: Date,
  ) {}
}
