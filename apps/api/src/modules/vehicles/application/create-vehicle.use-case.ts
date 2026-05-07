import { Injectable } from '@nestjs/common';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleType } from '../domain/vehicle-type.enum';
import { ServiceType } from '../domain/service-type.enum';
import { randomUUID } from 'crypto';

export interface CreateVehicleInput {
  plate: string;
  type: VehicleType;
  serviceType?: ServiceType;
  capacity: number;
  brand?: string;
  year?: number;
  driverName?: string;
  driverPhone?: string;
  companyId: string;
}

@Injectable()
export class CreateVehicleUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  async execute(input: CreateVehicleInput): Promise<Vehicle> {
    const now = new Date();
    const vehicle = new Vehicle(
      randomUUID(),
      input.plate,
      input.type,
      input.serviceType ?? ServiceType.NORMAL,
      input.capacity,
      input.brand ?? null,
      input.year ?? null,
      input.driverName ?? null,
      input.driverPhone ?? null,
      input.companyId,
      now,
      now,
    );
    return this.vehicles.save(vehicle);
  }
}
