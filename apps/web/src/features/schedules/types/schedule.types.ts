export interface Schedule {
  id: string;
  routeId: string;
  vehicleId: string;
  companyId: string;
  departureTime: string;
  days: string[];
  price: number;
  active: boolean;
  routeLabel?: string;
  vehicleLabel?: string;
  vehicleDriver?: string;
}

export interface CreateSchedulePayload {
  routeId: string;
  vehicleId: string;
  departureTime: string;
  days: string[];
  price: number;
}

export interface UpdateSchedulePayload {
  departureTime?: string;
  days?: string[];
  price?: number;
}

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
