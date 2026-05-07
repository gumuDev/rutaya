import { BadRequestException, Injectable } from '@nestjs/common';
import { ReservationRepository } from '../domain/reservation.repository';
import { Reservation } from '../domain/reservation.entity';
import { ReservationStatus } from '../domain/reservation-status.enum';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PrismaClient } from '../../../generated/prisma/client';
import { randomUUID } from 'crypto';

type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$use' | '$extends'>;

export interface PosReservationInput {
  scheduleId: string;
  companyId: string;
  passengerName: string;
  passengerPhone: string;
  quantity: number;
  paymentMethod: 'cash' | 'qr';
  travelDate: string;
  selectedSeats?: number[];
}

export interface PosReservationOutput {
  reservation: Reservation;
  scheduleInfo: {
    origin: string;
    destination: string;
    departureTime: string;
    price: number;
    companyName: string;
  };
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

@Injectable()
export class PosReservationUseCase {
  constructor(
    private readonly reservations: ReservationRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: PosReservationInput): Promise<PosReservationOutput> {
    return this.prisma.$transaction(async (tx: TxClient) => {
      const schedule = await tx.schedule.findUnique({
        where: { id: input.scheduleId },
        include: { route: true, vehicle: true, company: true },
      });

      if (!schedule) throw new BadRequestException('schedule_not_found');
      if (!schedule.active) throw new BadRequestException('schedule_inactive');
      if (schedule.companyId !== input.companyId) throw new BadRequestException('schedule_not_found');

      const reserved = await tx.reservation.aggregate({
        where: {
          scheduleId: input.scheduleId,
          travelDate: input.travelDate,
          status: { in: ['pending_payment', 'pending', 'confirmed'] },
        },
        _sum: { quantity: true },
      });

      const available = schedule.vehicle.capacity - (reserved._sum.quantity ?? 0);
      if (input.quantity > available) throw new BadRequestException('insufficient_capacity');

      const now = new Date();
      const row = await tx.reservation.create({
        data: {
          id: randomUUID(),
          code: generateCode(),
          scheduleId: input.scheduleId,
          companyId: input.companyId,
          passengerName: input.passengerName,
          passengerPhone: input.passengerPhone,
          quantity: input.quantity,
          status: 'confirmed',
          paymentMethod: input.paymentMethod,
          travelDate: input.travelDate,
          expiresAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // no expira
          createdAt: now,
          updatedAt: now,
        },
      });

      if (input.selectedSeats && input.selectedSeats.length > 0) {
        await tx.seatReservation.createMany({
          data: input.selectedSeats.map((seatNumber) => ({
            id: randomUUID(),
            scheduleId: input.scheduleId,
            travelDate: input.travelDate,
            seatNumber,
            reservationId: row.id,
          })),
        });
      }

      const reservation = new Reservation(
        row.id, row.code, row.scheduleId, row.companyId,
        row.passengerName, row.passengerPhone, row.quantity,
        ReservationStatus.CONFIRMED, row.createdAt, row.updatedAt, row.expiresAt,
      );

      return {
        reservation,
        scheduleInfo: {
          origin: schedule.route.origin,
          destination: schedule.route.destination,
          departureTime: schedule.departureTime,
          price: Number(schedule.price),
          companyName: schedule.company.name,
        },
      };
    });
  }
}
