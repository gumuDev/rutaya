import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../shared/auth';
import { CreateRouteUseCase } from '../application/create-route.use-case';
import { UpdateRouteUseCase } from '../application/update-route.use-case';
import { ListRoutesUseCase } from '../application/list-routes.use-case';
import { DeleteRouteUseCase } from '../application/delete-route.use-case';
import { CreateRouteDto, UpdateRouteDto } from './route.dto';

interface AuthRequest { user: { companyId: string } }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('routes')
export class RoutesController {
  constructor(
    private readonly create: CreateRouteUseCase,
    private readonly update: UpdateRouteUseCase,
    private readonly list: ListRoutesUseCase,
    private readonly remove: DeleteRouteUseCase,
  ) {}

  @Get()
  listRoutes(@Request() req: AuthRequest) {
    return this.list.execute(req.user.companyId);
  }

  @Post()
  createRoute(@Body() dto: CreateRouteDto, @Request() req: AuthRequest) {
    return this.create.execute({ ...dto, companyId: req.user.companyId });
  }

  @Patch(':id')
  updateRoute(@Param('id') id: string, @Body() dto: UpdateRouteDto, @Request() req: AuthRequest) {
    return this.update.execute({ id, companyId: req.user.companyId, ...dto });
  }

  @Delete(':id')
  @HttpCode(204)
  deleteRoute(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.remove.execute(id, req.user.companyId);
  }
}
