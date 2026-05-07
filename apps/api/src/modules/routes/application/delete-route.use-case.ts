import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { RouteRepository } from '../domain/route.repository';

@Injectable()
export class DeleteRouteUseCase {
  constructor(private readonly routes: RouteRepository) {}

  async execute(id: string, companyId: string): Promise<void> {
    const route = await this.routes.findById(id, companyId);
    if (!route) throw new NotFoundException('route_not_found');
    const hasSchedules = await this.routes.hasActiveSchedules(id);
    if (hasSchedules) throw new ConflictException('route_has_active_schedules');
    await this.routes.delete(id, companyId);
  }
}
