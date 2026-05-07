import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';
import { VehicleType } from '../domain/vehicle-type.enum';
import { ServiceType } from '../domain/service-type.enum';

export interface UpdateVehicleInput {
  id: string;
  companyId: string;
  plate?: string;
  type?: VehicleType;
  serviceType?: ServiceType;
  capacity?: number;
  brand?: string;
  year?: number;
  driverName?: string;
  driverPhone?: string;
}

@Injectable()
export class UpdateVehicleUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  async execute(input: UpdateVehicleInput): Promise<Vehicle> {
    const vehicle = await this.vehicles.findById(input.id, input.companyId);
    if (!vehicle) throw new NotFoundException('vehicle_not_found');

    if (input.plate !== undefined) vehicle.plate = input.plate;
    if (input.type !== undefined) vehicle.type = input.type;
    if (input.serviceType !== undefined) vehicle.serviceType = input.serviceType;
    if (input.capacity !== undefined) vehicle.capacity = input.capacity;
    if (input.brand !== undefined) vehicle.brand = input.brand;
    if (input.year !== undefined) vehicle.year = input.year;
    if (input.driverName !== undefined) vehicle.driverName = input.driverName;
    if (input.driverPhone !== undefined) vehicle.driverPhone = input.driverPhone;

    return this.vehicles.save(vehicle);
  }
}
