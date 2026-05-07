import { Injectable } from '@nestjs/common';
import { RouteRepository } from '../domain/route.repository';
import { Route } from '../domain/route.entity';

@Injectable()
export class ListRoutesUseCase {
  constructor(private readonly routes: RouteRepository) {}

  async execute(companyId: string): Promise<Route[]> {
    return this.routes.findByCompany(companyId);
  }
}
