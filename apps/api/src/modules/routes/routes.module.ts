import { Module } from '@nestjs/common';
import { RoutesController } from './presentation/routes.controller';
import { CreateRouteUseCase } from './application/create-route.use-case';
import { UpdateRouteUseCase } from './application/update-route.use-case';
import { ListRoutesUseCase } from './application/list-routes.use-case';
import { DeleteRouteUseCase } from './application/delete-route.use-case';
import { PrismaRouteRepository } from './infrastructure/prisma-route.repository';
import { RouteRepository } from './domain/route.repository';

@Module({
  controllers: [RoutesController],
  providers: [
    CreateRouteUseCase, UpdateRouteUseCase, ListRoutesUseCase, DeleteRouteUseCase,
    { provide: RouteRepository, useClass: PrismaRouteRepository },
  ],
  exports: [RouteRepository],
})
export class RoutesModule {}
