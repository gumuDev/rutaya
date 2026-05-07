import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class ExpireReservationsUseCase {
  private readonly logger = new Logger(ExpireReservationsUseCase.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<number> {
    const now = new Date();

    const result = await this.prisma.reservation.updateMany({
      where: {
        status: { in: ['pending_payment', 'pending'] },
        expiresAt: { lte: now },
      },
      data: { status: 'expired', updatedAt: now },
    });

    if (result.count > 0) {
      this.logger.log(`Expired ${result.count} reservation(s)`);
    }

    return result.count;
  }
}
