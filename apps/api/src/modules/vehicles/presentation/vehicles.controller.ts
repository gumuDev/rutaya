import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../../shared/auth';
import { CreateVehicleUseCase } from '../application/create-vehicle.use-case';
import { UpdateVehicleUseCase } from '../application/update-vehicle.use-case';
import { ListVehiclesUseCase } from '../application/list-vehicles.use-case';
import { DeleteVehicleUseCase } from '../application/delete-vehicle.use-case';
import { CreateVehicleDto, UpdateVehicleDto } from './vehicle.dto';

interface AuthRequest {
  user: { companyId: string };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly create: CreateVehicleUseCase,
    private readonly update: UpdateVehicleUseCase,
    private readonly list: ListVehiclesUseCase,
    private readonly remove: DeleteVehicleUseCase,
  ) {}

  @Get()
  listVehicles(@Request() req: AuthRequest) {
    return this.list.execute(req.user.companyId);
  }

  @Post()
  createVehicle(@Body() dto: CreateVehicleDto, @Request() req: AuthRequest) {
    return this.create.execute({ ...dto, companyId: req.user.companyId });
  }

  @Patch(':id')
  updateVehicle(@Param('id') id: string, @Body() dto: UpdateVehicleDto, @Request() req: AuthRequest) {
    return this.update.execute({ id, companyId: req.user.companyId, ...dto });
  }

  @Delete(':id')
  @HttpCode(204)
  deleteVehicle(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.remove.execute(id, req.user.companyId);
  }
}
