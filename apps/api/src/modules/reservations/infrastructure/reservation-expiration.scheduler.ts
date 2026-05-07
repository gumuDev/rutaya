import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExpireReservationsUseCase } from '../application/expire-reservations.use-case';

@Injectable()
export class ReservationExpirationScheduler {
  private readonly logger = new Logger(ReservationExpirationScheduler.name);

  constructor(private readonly expireReservations: ExpireReservationsUseCase) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleExpiration() {
    this.logger.debug('Running reservation expiration check...');
    await this.expireReservations.execute();
  }
}
