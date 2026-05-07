import { Module } from '@nestjs/common';
import { ReservationsController } from './presentation/reservations.controller';
import { CreateReservationUseCase } from './application/create-reservation.use-case';
import { CancelReservationUseCase } from './application/cancel-reservation.use-case';
import { ConfirmReservationUseCase } from './application/confirm-reservation.use-case';
import { BoardReservationUseCase } from './application/board-reservation.use-case';
import { GetReservationUseCase } from './application/get-reservation.use-case';
import { SearchSchedulesUseCase } from './application/search-schedules.use-case';
import { ListCompanyReservationsUseCase } from './application/list-company-reservations.use-case';
import { ExpireReservationsUseCase } from './application/expire-reservations.use-case';
import { RecoverReservationUseCase } from './application/recover-reservation.use-case';
import { GetSeatsUseCase } from './application/get-seats.use-case';
import { PosReservationUseCase } from './application/pos-reservation.use-case';
import { PrismaReservationRepository } from './infrastructure/prisma-reservation.repository';
import { ReservationExpirationScheduler } from './infrastructure/reservation-expiration.scheduler';
import { ReservationRepository } from './domain/reservation.repository';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationUseCase, CancelReservationUseCase,
    ConfirmReservationUseCase, BoardReservationUseCase,
    GetReservationUseCase, SearchSchedulesUseCase,
    ListCompanyReservationsUseCase, ExpireReservationsUseCase,
    RecoverReservationUseCase, GetSeatsUseCase, ReservationExpirationScheduler,
    PosReservationUseCase,
    { provide: ReservationRepository, useClass: PrismaReservationRepository },
  ],
  exports: [ReservationRepository],
})
export class ReservationsModule {}
