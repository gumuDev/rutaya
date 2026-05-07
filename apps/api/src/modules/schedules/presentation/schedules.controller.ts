import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../shared/auth';
import { CreateScheduleUseCase } from '../application/create-schedule.use-case';
import { UpdateScheduleUseCase } from '../application/update-schedule.use-case';
import { ListSchedulesUseCase } from '../application/list-schedules.use-case';
import { DeleteScheduleUseCase } from '../application/delete-schedule.use-case';
import { ToggleScheduleUseCase } from '../application/toggle-schedule.use-case';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';

interface AuthRequest { user: { companyId: string } }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('schedules')
export class SchedulesController {
  constructor(
    private readonly create: CreateScheduleUseCase,
    private readonly update: UpdateScheduleUseCase,
    private readonly list: ListSchedulesUseCase,
    private readonly remove: DeleteScheduleUseCase,
    private readonly toggle: ToggleScheduleUseCase,
  ) {}

  @Get()
  listSchedules(@Request() req: AuthRequest) {
    return this.list.execute(req.user.companyId);
  }

  @Post()
  createSchedule(@Body() dto: CreateScheduleDto, @Request() req: AuthRequest) {
    return this.create.execute({ ...dto, companyId: req.user.companyId });
  }

  @Patch(':id')
  updateSchedule(@Param('id') id: string, @Body() dto: UpdateScheduleDto, @Request() req: AuthRequest) {
    return this.update.execute({ id, companyId: req.user.companyId, ...dto });
  }

  @Patch(':id/toggle')
  toggleSchedule(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.toggle.execute(id, req.user.companyId);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteSchedule(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.remove.execute(id, req.user.companyId);
  }
}
