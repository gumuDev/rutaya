import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

export interface SearchSchedulesInput {
  origin: string;
  destination: string;
  date: string;
  passengers?: number;
}

@Injectable()
export class SearchSchedulesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: SearchSchedulesInput) {
    // Parse date at noon to avoid UTC midnight shifting the day when TZ=America/La_Paz
    const dayOfWeek = new Date(`${input.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

    const schedules = await this.prisma.schedule.findMany({
      where: {
        active: true,
        days: { has: dayOfWeek },
        route: { origin: { contains: input.origin, mode: 'insensitive' }, destination: { contains: input.destination, mode: 'insensitive' } },
      },
      include: {
        route: true,
        vehicle: true,
        company: true,
      },
      orderBy: { departureTime: 'asc' },
    });

    const results = await Promise.all(schedules.map(async (s) => {
      const reserved = await this.prisma.reservation.aggregate({
        where: {
          scheduleId: s.id,
          travelDate: input.date,
          status: { in: ['pending_payment', 'pending', 'confirmed'] },
        },
        _sum: { quantity: true },
      });
      const totalReserved = reserved._sum.quantity ?? 0;
      const available = s.vehicle.capacity - totalReserved;

      return {
        id: s.id,
        origin: s.route.origin,
        destination: s.route.destination,
        departureTime: s.departureTime,
        price: Number(s.price),
        companyName: s.company.name,
        vehicleType: s.vehicle.type,
        serviceType: s.vehicle.serviceType,
        capacity: s.vehicle.capacity,
        available,
        payment: {
          bankName: s.company.bankName,
          bankAccount: s.company.bankAccount,
          bankAccountHolder: s.company.bankAccountHolder,
          qrImageUrl: s.company.qrImageUrl,
        },
      };
    }));

    const minSeats = input.passengers && input.passengers > 1 ? input.passengers : 1;
    return results.filter((r) => r.available >= minSeats);
  }
}
