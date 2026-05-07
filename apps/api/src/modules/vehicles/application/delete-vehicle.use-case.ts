import { Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../domain/vehicle.repository';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(private readonly vehicles: VehicleRepository) {}

  async execute(id: string, companyId: string): Promise<void> {
    const vehicle = await this.vehicles.findById(id, companyId);
    if (!vehicle) throw new NotFoundException('vehicle_not_found');
    await this.vehicles.delete(id, companyId);
  }
}
