import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './shared/prisma/prisma.module';
import { HealthModule } from './shared/health/health.module';
import { AuthModule } from './shared/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { RoutesModule } from './modules/routes/routes.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { CitiesModule } from './modules/cities/cities.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule, PrismaModule, AuthModule, HealthModule,
    CompaniesModule, VehiclesModule, RoutesModule, SchedulesModule, ReservationsModule,
    CitiesModule, UploadModule,
  ],
})
export class AppModule {}
