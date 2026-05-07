import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleType } from '../domain/vehicle-type.enum';
import { ServiceType } from '../domain/service-type.enum';

@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, companyId: string): Promise<Vehicle | null> {
    const row = await this.prisma.vehicle.findFirst({ where: { id, companyId } });
    return row ? this.toDomain(row) : null;
  }

  async findByCompany(companyId: string): Promise<Vehicle[]> {
    const rows = await this.prisma.vehicle.findMany({
      where: { companyId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async save(vehicle: Vehicle): Promise<Vehicle> {
    const row = await this.prisma.vehicle.upsert({
      where: { id: vehicle.id },
      create: {
        id: vehicle.id,
        plate: vehicle.plate,
        type: vehicle.type,
        serviceType: vehicle.serviceType,
        capacity: vehicle.capacity,
        brand: vehicle.brand,
        year: vehicle.year,
        driverName: vehicle.driverName,
        driverPhone: vehicle.driverPhone,
        companyId: vehicle.companyId,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      },
      update: {
        plate: vehicle.plate,
        type: vehicle.type,
        serviceType: vehicle.serviceType,
        capacity: vehicle.capacity,
        brand: vehicle.brand,
        year: vehicle.year,
        driverName: vehicle.driverName,
        driverPhone: vehicle.driverPhone,
        updatedAt: new Date(),
      },
    });
    return this.toDomain(row);
  }

  async delete(id: string, companyId: string): Promise<void> {
    await this.prisma.vehicle.deleteMany({ where: { id, companyId } });
  }

  private toDomain(row: {
    id: string; plate: string; type: string; serviceType: string;
    capacity: number; brand: string | null; year: number | null;
    driverName: string | null; driverPhone: string | null;
    companyId: string; createdAt: Date; updatedAt: Date;
  }): Vehicle {
    return new Vehicle(
      row.id, row.plate,
      row.type as VehicleType,
      row.serviceType as ServiceType,
      row.capacity,
      row.brand, row.year,
      row.driverName, row.driverPhone,
      row.companyId, row.createdAt, row.updatedAt,
    );
  }
}
