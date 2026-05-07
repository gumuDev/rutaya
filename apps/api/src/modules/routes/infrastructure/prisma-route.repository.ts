import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { RouteRepository } from '../domain/route.repository';
import { Route } from '../domain/route.entity';

@Injectable()
export class PrismaRouteRepository implements RouteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, companyId: string): Promise<Route | null> {
    const row = await this.prisma.route.findFirst({ where: { id, companyId } });
    return row ? this.toDomain(row) : null;
  }

  async findByCompany(companyId: string): Promise<Route[]> {
    const rows = await this.prisma.route.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(route: Route): Promise<Route> {
    const row = await this.prisma.route.upsert({
      where: { id: route.id },
      create: {
        id: route.id,
        origin: route.origin,
        destination: route.destination,
        basePrice: route.basePrice,
        companyId: route.companyId,
        createdAt: route.createdAt,
        updatedAt: route.updatedAt,
      },
      update: {
        origin: route.origin,
        destination: route.destination,
        basePrice: route.basePrice,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await this.prisma.route.deleteMany({ where: { id, companyId } });
  }

  async hasActiveSchedules(id: string): Promise<boolean> {
    const count = await this.prisma.schedule.count({ where: { routeId: id, active: true } });
    return count > 0;
  }

  private toDomain(row: {
    id: string; origin: string; destination: string;
    basePrice: unknown; companyId: string; createdAt: Date; updatedAt: Date;
  }): Route {
    return new Route(row.id, row.origin, row.destination, Number(row.basePrice), row.companyId, row.createdAt, row.updatedAt);
  }
}
