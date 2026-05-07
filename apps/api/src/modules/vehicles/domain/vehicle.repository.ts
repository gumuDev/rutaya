import { Vehicle } from './vehicle.entity';

export abstract class VehicleRepository {
  abstract findById(id: string, companyId: string): Promise<Vehicle | null>;
  abstract findByCompany(companyId: string): Promise<Vehicle[]>;
  abstract save(vehicle: Vehicle): Promise<Vehicle>;
  abstract delete(id: string, companyId: string): Promise<void>;
}
