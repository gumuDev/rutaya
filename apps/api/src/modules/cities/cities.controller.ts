import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Controller('cities')
export class CitiesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async search(@Query('q') q: string) {
    if (!q || q.trim().length < 2) return [];
    return this.prisma.city.findMany({
      where: { name: { contains: q.trim(), mode: 'insensitive' } },
      orderBy: { name: 'asc' },
      take: 10,
      select: { id: true, name: true, department: true },
    });
  }
}
