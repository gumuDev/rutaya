export enum VehicleType {
  TRUFI = 'trufi',
  MINIBUS = 'minibus',
  BUS = 'bus',
}

export enum ServiceType {
  NORMAL = 'normal',
  SEMICAMA = 'semicama',
  CAMA = 'cama',
  LEITO = 'leito',
}

export interface Vehicle {
  id: string;
  plate: string;
  type: VehicleType;
  serviceType: ServiceType;
  capacity: number;
  brand: string | null;
  year: number | null;
  driverName: string | null;
  driverPhone: string | null;
  companyId: string;
}

export interface CreateVehiclePayload {
  plate: string;
  type: VehicleType;
  serviceType?: ServiceType;
  capacity: number;
  brand?: string;
  year?: number;
  driverName?: string;
  driverPhone?: string;
}

export interface UpdateVehiclePayload {
  plate?: string;
  type?: VehicleType;
  serviceType?: ServiceType;
  capacity?: number;
  brand?: string;
  year?: number;
  driverName?: string;
  driverPhone?: string;
}
