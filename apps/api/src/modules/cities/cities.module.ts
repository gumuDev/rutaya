import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CitiesController],
})
export class CitiesModule {}
