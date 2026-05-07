import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class GetSeatsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(scheduleId: string, travelDate: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { vehicle: true },
    });

    if (!schedule) throw new NotFoundException('schedule_not_found');
    if (schedule.vehicle.type !== 'bus') {
      return { vehicleType: schedule.vehicle.type, serviceType: schedule.vehicle.serviceType, capacity: schedule.vehicle.capacity, takenSeats: [] };
    }

    const taken = await this.prisma.seatReservation.findMany({
      where: {
        scheduleId,
        travelDate,
        reservation: { status: { in: ['pending_payment', 'pending', 'confirmed'] } },
      },
      select: { seatNumber: true },
    });

    return {
      vehicleType: schedule.vehicle.type,
      serviceType: schedule.vehicle.serviceType,
      capacity: schedule.vehicle.capacity,
      takenSeats: taken.map((s) => s.seatNumber),
    };
  }
}
