import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class RecoverReservationUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(code: string) {
    const row = await this.prisma.reservation.findFirst({
      where: { code: code.toUpperCase() },
      include: {
        schedule: { include: { route: true, vehicle: true, company: true } },
      },
    });

    if (!row) throw new NotFoundException('reservation_not_found');
    return row;
  }
}
