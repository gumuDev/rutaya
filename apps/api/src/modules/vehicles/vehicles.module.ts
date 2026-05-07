import { Module } from '@nestjs/common';
import { VehiclesController } from './presentation/vehicles.controller';
import { CreateVehicleUseCase } from './application/create-vehicle.use-case';
import { UpdateVehicleUseCase } from './application/update-vehicle.use-case';
import { ListVehiclesUseCase } from './application/list-vehicles.use-case';
import { DeleteVehicleUseCase } from './application/delete-vehicle.use-case';
import { PrismaVehicleRepository } from './infrastructure/prisma-vehicle.repository';
import { VehicleRepository } from './domain/vehicle.repository';
@Module({
  imports: [],
  controllers: [VehiclesController],
  providers: [
    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    ListVehiclesUseCase,
    DeleteVehicleUseCase,
    { provide: VehicleRepository, useClass: PrismaVehicleRepository },
  ],
})
export class VehiclesModule {}
