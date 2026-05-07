import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../domain/schedule.repository';
import { Schedule } from '../domain/schedule.entity';

@Injectable()
export class ListSchedulesUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  async execute(companyId: string): Promise<Schedule[]> {
    return this.schedules.findByCompany(companyId);
  }
}
