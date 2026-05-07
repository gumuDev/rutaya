export interface Route {
  id: string;
  origin: string;
  destination: string;
  basePrice: number;
  companyId: string;
}

export interface CreateRoutePayload {
  origin: string;
  destination: string;
  basePrice: number;
}

export interface UpdateRoutePayload {
  origin?: string;
  destination?: string;
  basePrice?: number;
}
