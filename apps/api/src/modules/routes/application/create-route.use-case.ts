import { Injectable } from '@nestjs/common';
import { RouteRepository } from '../domain/route.repository';
import { Route } from '../domain/route.entity';
import { randomUUID } from 'crypto';

export interface CreateRouteInput {
  origin: string;
  destination: string;
  basePrice: number;
  companyId: string;
}

@Injectable()
export class CreateRouteUseCase {
  constructor(private readonly routes: RouteRepository) {}

  async execute(input: CreateRouteInput): Promise<Route> {
    const now = new Date();
    const route = new Route(randomUUID(), input.origin, input.destination, input.basePrice, input.companyId, now, now);
    return this.routes.save(route);
  }
}
