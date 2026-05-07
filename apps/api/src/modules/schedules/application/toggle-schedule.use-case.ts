import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleRepository } from '../domain/schedule.repository';
import { Schedule } from '../domain/schedule.entity';

@Injectable()
export class ToggleScheduleUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  async execute(id: string, companyId: string): Promise<Schedule> {
    const schedule = await this.schedules.findById(id, companyId);
    if (!schedule) throw new NotFoundException('schedule_not_found');
    schedule.active = !schedule.active;
    return this.schedules.save(schedule);
  }
}
