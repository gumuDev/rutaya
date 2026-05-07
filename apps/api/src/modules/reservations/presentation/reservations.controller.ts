import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';
import { CreateReservationUseCase } from '../application/create-reservation.use-case';
import { CancelReservationUseCase } from '../application/cancel-reservation.use-case';
import { ConfirmReservationUseCase } from '../application/confirm-reservation.use-case';
import { BoardReservationUseCase } from '../application/board-reservation.use-case';
import { GetReservationUseCase } from '../application/get-reservation.use-case';
import { SearchSchedulesUseCase } from '../application/search-schedules.use-case';
import { ListCompanyReservationsUseCase } from '../application/list-company-reservations.use-case';
import { SearchSchedulesDto, CreateReservationDto, PosReservationDto } from './reservation.dto';
import { RecoverReservationUseCase } from '../application/recover-reservation.use-case';
import { GetSeatsUseCase } from '../application/get-seats.use-case';
import { PosReservationUseCase } from '../application/pos-reservation.use-case';
import { RolesGuard, Roles } from '../../../shared/auth';

interface AuthRequest { user: { companyId: string } }

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly create: CreateReservationUseCase,
    private readonly cancel: CancelReservationUseCase,
    private readonly confirm: ConfirmReservationUseCase,
    private readonly board: BoardReservationUseCase,
    private readonly get: GetReservationUseCase,
    private readonly search: SearchSchedulesUseCase,
    private readonly listCompany: ListCompanyReservationsUseCase,
    private readonly recover: RecoverReservationUseCase,
    private readonly getSeats: GetSeatsUseCase,
    private readonly pos: PosReservationUseCase,
  ) {}

  @Get('search')
  searchSchedules(@Query() dto: SearchSchedulesDto) {
    return this.search.execute(dto);
  }

  @Post()
  createReservation(@Body() dto: CreateReservationDto) {
    return this.create.execute(dto);
  }

  @Post('pos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  posReservation(@Body() dto: PosReservationDto, @Request() req: AuthRequest) {
    return this.pos.execute({ ...dto, companyId: req.user.companyId });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  listReservations(
    @Request() req: AuthRequest,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.listCompany.execute({ companyId: req.user.companyId, status, date });
  }

  @Get('recover')
  recoverReservation(@Query('code') code: string) {
    return this.recover.execute(code);
  }

  @Get('seats/:scheduleId')
  getSeatsForSchedule(@Param('scheduleId') scheduleId: string, @Query('date') date: string) {
    return this.getSeats.execute(scheduleId, date);
  }

  @Get(':code')
  getReservation(@Param('code') code: string) {
    return this.get.execute(code);
  }

  @Patch(':code/confirm')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  confirmReservation(@Param('code') code: string, @Request() req: AuthRequest) {
    return this.confirm.execute(code, req.user.companyId);
  }

  @Patch(':code/cancel')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  cancelReservation(@Param('code') code: string, @Request() req: AuthRequest) {
    return this.cancel.execute(code, req.user.companyId);
  }

  @Patch(':code/board')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  boardReservation(@Param('code') code: string, @Request() req: AuthRequest) {
    return this.board.execute(code, req.user.companyId);
  }
}
