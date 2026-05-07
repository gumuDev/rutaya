import { VehicleType } from './vehicle-type.enum';
import { ServiceType } from './service-type.enum';

export class Vehicle {
  constructor(
    public readonly id: string,
    public plate: string,
    public type: VehicleType,
    public serviceType: ServiceType,
    public capacity: number,
    public brand: string | null,
    public year: number | null,
    public driverName: string | null,
    public driverPhone: string | null,
    public readonly companyId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
