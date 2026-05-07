import { Module } from '@nestjs/common';
import { SchedulesController } from './presentation/schedules.controller';
import { CreateScheduleUseCase } from './application/create-schedule.use-case';
import { UpdateScheduleUseCase } from './application/update-schedule.use-case';
import { ListSchedulesUseCase } from './application/list-schedules.use-case';
import { DeleteScheduleUseCase } from './application/delete-schedule.use-case';
import { ToggleScheduleUseCase } from './application/toggle-schedule.use-case';
import { PrismaScheduleRepository } from './infrastructure/prisma-schedule.repository';
import { ScheduleRepository } from './domain/schedule.repository';

@Module({
  controllers: [SchedulesController],
  providers: [
    CreateScheduleUseCase, UpdateScheduleUseCase, ListSchedulesUseCase,
    DeleteScheduleUseCase, ToggleScheduleUseCase,
    { provide: ScheduleRepository, useClass: PrismaScheduleRepository },
  ],
  exports: [ScheduleRepository],
})
export class SchedulesModule {}
