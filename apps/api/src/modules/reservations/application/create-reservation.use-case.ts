import { BadRequestException, Injectable } from '@nestjs/common';
import { ReservationRepository } from '../domain/reservation.repository';
import { Reservation } from '../domain/reservation.entity';
import { ReservationStatus } from '../domain/reservation-status.enum';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { PrismaClient } from '../../../generated/prisma/client';
import { TelegramNotifierService } from '../../companies/infrastructure/telegram-notifier.service';
import { randomUUID } from 'crypto';

type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$use' | '$extends'>;

export interface CreateReservationInput {
  scheduleId: string;
  passengerName: string;
  passengerPhone: string;
  quantity: number;
  paymentMethod: 'bank_transfer' | 'qr';
  proofImageUrl?: string;
  travelDate: string;
  selectedSeats?: number[];
}

export interface CreateReservationOutput {
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
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private readonly reservations: ReservationRepository,
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramNotifierService,
  ) {}

  async execute(input: CreateReservationInput): Promise<CreateReservationOutput> {
    return this.prisma.$transaction(async (tx: TxClient) => {
      const schedule = await tx.schedule.findUnique({
        where: { id: input.scheduleId },
        include: { route: true, vehicle: true, company: true },
      });

      if (!schedule) throw new BadRequestException('schedule_not_found');
      if (!schedule.active) throw new BadRequestException('schedule_inactive');

      const reserved = await tx.reservation.aggregate({
        where: {
          scheduleId: input.scheduleId,
          travelDate: input.travelDate,
          status: { in: ['pending_payment', 'pending', 'confirmed'] },
        },
        _sum: { quantity: true },
      });

      const totalReserved = reserved._sum.quantity ?? 0;
      const available = schedule.vehicle.capacity - totalReserved;

      if (input.quantity > available) {
        throw new BadRequestException('insufficient_capacity');
      }

      const code = generateCode();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

      const row = await tx.reservation.create({
        data: {
          id: randomUUID(),
          code,
          scheduleId: input.scheduleId,
          companyId: schedule.companyId,
          passengerName: input.passengerName,
          passengerPhone: input.passengerPhone,
          quantity: input.quantity,
          status: input.proofImageUrl ? 'pending' : 'pending_payment',
          paymentMethod: input.paymentMethod,
          proofImageUrl: input.proofImageUrl ?? null,
          travelDate: input.travelDate,
          expiresAt,
          createdAt: now,
          updatedAt: now,
        },
      });

      // Si es bus y hay asientos seleccionados, guardarlos
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
        ReservationStatus.PENDING, row.createdAt, row.updatedAt, row.expiresAt,
      );

      const output = {
        reservation,
        scheduleInfo: {
          origin: schedule.route.origin,
          destination: schedule.route.destination,
          departureTime: schedule.departureTime,
          price: Number(schedule.price),
          companyName: schedule.company.name,
        },
      };

      // Notificación Telegram — no bloquea el flujo si falla
      if (schedule.company.telegramChatId) {
        this.telegram.sendReservationNotification(schedule.company.telegramChatId, {
          code: row.code,
          origin: schedule.route.origin,
          destination: schedule.route.destination,
          departureTime: schedule.departureTime,
          passengerName: input.passengerName,
          passengerPhone: input.passengerPhone,
          quantity: input.quantity,
          paymentMethod: input.paymentMethod,
          proofImageUrl: input.proofImageUrl ?? null,
          status: row.status,
        }).catch(() => {});
      }

      return output;
    });
  }
}
