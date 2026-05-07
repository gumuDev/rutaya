import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';

export interface ListReservationsFilter {
  companyId: string;
  status?: string;
  date?: string;
}

@Injectable()
export class ListCompanyReservationsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(filter: ListReservationsFilter) {
    const where: Record<string, unknown> = { companyId: filter.companyId };
    if (filter.status) where['status'] = filter.status;
    if (filter.date) {
      const start = new Date(filter.date + 'T00:00:00.000Z');
      const end = new Date(filter.date + 'T23:59:59.999Z');
      where['createdAt'] = { gte: start, lte: end };
    }

    return this.prisma.reservation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        schedule: {
          include: { route: true, vehicle: true },
        },
      },
    });
  }
}
