import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteRepository } from '../domain/route.repository';
import { Route } from '../domain/route.entity';

export interface UpdateRouteInput {
  id: string;
  companyId: string;
  origin?: string;
  destination?: string;
  basePrice?: number;
}

@Injectable()
export class UpdateRouteUseCase {
  constructor(private readonly routes: RouteRepository) {}

  async execute(input: UpdateRouteInput): Promise<Route> {
    const route = await this.routes.findById(input.id, input.companyId);
    if (!route) throw new NotFoundException('route_not_found');
    if (input.origin !== undefined) route.origin = input.origin;
    if (input.destination !== undefined) route.destination = input.destination;
    if (input.basePrice !== undefined) route.basePrice = input.basePrice;
    return this.routes.save(route);
  }
}
