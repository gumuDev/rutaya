import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ScheduleRepository } from '../domain/schedule.repository';
import { Schedule } from '../domain/schedule.entity';

@Injectable()
export class PrismaScheduleRepository implements ScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, companyId: string): Promise<Schedule | null> {
    const row = await this.prisma.schedule.findFirst({ where: { id, companyId } });
    return row ? this.toDomain(row) : null;
  }

  async findByCompany(companyId: string): Promise<Schedule[]> {
    const rows = await this.prisma.schedule.findMany({
      where: { companyId },
      orderBy: { departureTime: 'asc' },
      include: { route: true, vehicle: true },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(schedule: Schedule): Promise<Schedule> {
    const row = await this.prisma.schedule.upsert({
      where: { id: schedule.id },
      create: {
        id: schedule.id, routeId: schedule.routeId, vehicleId: schedule.vehicleId,
        companyId: schedule.companyId, departureTime: schedule.departureTime,
        days: schedule.days, price: schedule.price, active: schedule.active,
        createdAt: schedule.createdAt, updatedAt: schedule.updatedAt,
      },
      update: {
        departureTime: schedule.departureTime, days: schedule.days,
        price: schedule.price, active: schedule.active, updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await this.prisma.schedule.deleteMany({ where: { id, companyId } });
  }

  private toDomain(row: {
    id: string; routeId: string; vehicleId: string; companyId: string;
    departureTime: string; days: string[]; price: unknown;
    active: boolean; createdAt: Date; updatedAt: Date;
    route?: { origin: string; destination: string } | null;
    vehicle?: { plate: string; capacity: number; type: string; serviceType: string; brand: string | null; year: number | null; driverName: string | null } | null;
  }): Schedule {
    const s = new Schedule(
      row.id, row.routeId, row.vehicleId, row.companyId,
      row.departureTime, row.days, Number(row.price), row.active,
      row.createdAt, row.updatedAt,
    );
    // attach display info for API responses
    (s as Schedule & { routeLabel?: string }).routeLabel =
      row.route ? `${row.route.origin} → ${row.route.destination}` : undefined;
    if (row.vehicle) {
      const v = row.vehicle;
      const serviceLabel = v.serviceType !== 'normal' ? ` ${v.serviceType.charAt(0).toUpperCase() + v.serviceType.slice(1)}` : '';
      const typeLabel = v.type.charAt(0).toUpperCase() + v.type.slice(1);
      const vehicleDetail = [v.brand, v.year].filter(Boolean).join(' ');
      (s as Schedule & { vehicleLabel?: string; vehicleDriver?: string }).vehicleLabel =
        `${v.plate} · ${typeLabel}${serviceLabel}${vehicleDetail ? ` · ${vehicleDetail}` : ''}`;
      (s as Schedule & { vehicleDriver?: string }).vehicleDriver = v.driverName ?? undefined;
    }
    return s;
  }
}
