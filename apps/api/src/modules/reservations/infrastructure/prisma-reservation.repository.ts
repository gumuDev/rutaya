import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReservationRepository } from '../domain/reservation.repository';
import { Reservation } from '../domain/reservation.entity';
import { ReservationStatus } from '../domain/reservation-status.enum';

@Injectable()
export class PrismaReservationRepository implements ReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCode(code: string): Promise<Reservation | null> {
    const row = await this.prisma.reservation.findUnique({ where: { code } });
    return row ? this.toDomain(row) : null;
  }

  async findByCodeAndPhone(code: string, phone: string): Promise<Reservation | null> {
    const row = await this.prisma.reservation.findFirst({ where: { code, passengerPhone: phone } });
    return row ? this.toDomain(row) : null;
  }

  async findByCompany(companyId: string): Promise<Reservation[]> {
    const rows = await this.prisma.reservation.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(reservation: Reservation): Promise<Reservation> {
    const row = await this.prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: reservation.status, updatedAt: new Date() },
    });
    return this.toDomain(row);
  }

  async countActiveBySchedule(scheduleId: string): Promise<number> {
    const result = await this.prisma.reservation.aggregate({
      where: { scheduleId, status: { in: ['pending', 'confirmed'] } },
      _sum: { quantity: true },
    });
    return result._sum.quantity ?? 0;
  }

  private toDomain(row: {
    id: string; code: string; scheduleId: string; companyId: string;
    passengerName: string; passengerPhone: string; quantity: number;
    status: string; createdAt: Date; updatedAt: Date; expiresAt: Date;
  }): Reservation {
    return new Reservation(
      row.id, row.code, row.scheduleId, row.companyId,
      row.passengerName, row.passengerPhone, row.quantity,
      row.status as ReservationStatus,
      row.createdAt, row.updatedAt, row.expiresAt,
    );
  }
}
