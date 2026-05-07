import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../domain/schedule.repository';
import { Schedule } from '../domain/schedule.entity';
import { randomUUID } from 'crypto';

export interface CreateScheduleInput {
  routeId: string;
  vehicleId: string;
  companyId: string;
  departureTime: string;
  days: string[];
  price: number;
}

@Injectable()
export class CreateScheduleUseCase {
  constructor(private readonly schedules: ScheduleRepository) {}

  async execute(input: CreateScheduleInput): Promise<Schedule> {
    const now = new Date();
    const schedule = new Schedule(
      randomUUID(), input.routeId, input.vehicleId, input.companyId,
      input.departureTime, input.days, input.price, true, now, now,
    );
    return this.schedules.save(schedule);
  }
}
