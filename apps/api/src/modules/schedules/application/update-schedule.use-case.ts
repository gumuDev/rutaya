import { Injectable, NotFoundException } from '@nestjs/common';
import { ScheduleRepository } from '../domain/schedule.repository';
import { Schedule } from '../domain/schedule.entity';

export interface UpdateScheduleInput {
  id: string;
  companyId: string;
  departureTime?: string;
  days?: string[];
  price?: number;
}

@Injectable()
export class UpdateScheduleUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  async execute(input: UpdateScheduleInput): Promise<Schedule> {
    const schedule = await this.schedules.findById(input.id, input.companyId);
    if (!schedule) throw new NotFoundException('schedule_not_found');
    if (input.departureTime !== undefined) schedule.departureTime = input.departureTime;
    if (input.days !== undefined) schedule.days = input.days;
    if (input.price !== undefined) schedule.price = input.price;
    return this.schedules.save(schedule);
  }
}
