import { Injectable } from '@nestjs/common';
import { VehicleRepository } from '../domain/vehicle.repository';
import { Vehicle } from '../domain/vehicle.entity';

@Injectable()
export class ListVehiclesUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  async execute(companyId: string): Promise<Vehicle[]> {
    return this.vehicles.findByCompany(companyId);
  }
}
