import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleRepository } from '../domain/schedule.repository';

@Injectable()
export class DeleteScheduleUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  async execute(id: string, companyId: string): Promise<void> {
    const schedule = await this.schedules.findById(id, companyId);
    if (!schedule) throw new NotFoundException('schedule_not_found');
    await this.schedules.delete(id, companyId);
  }
}
