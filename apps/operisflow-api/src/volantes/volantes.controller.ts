import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import { VolantesService } from './volantes.service';
import { CreateVolanteDto } from './dto/create-volante.dto';
import { UpdateVolanteDto } from './dto/update-volante.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Tenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('volantes')
@UseGuards(JwtAuthGuard)
export class VolantesController {
  constructor(private readonly volantesService: VolantesService) {}

  private ensureAdmin(user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem modificar volantes');
    }
  }

  // ADMIN → criar volante
  @Post()
  create(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateVolanteDto,
  ) {
    this.ensureAdmin(user);
    return this.volantesService.create(tenantId, dto);
  }

  // CLIENTE + ADMIN → lista de volantes
  @Get()
  findAll(@Tenant() tenantId: string) {
    return this.volantesService.findAll(tenantId);
  }

  // ADMIN → editar volante
  @Patch(':id')
  update(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateVolanteDto,
  ) {
    this.ensureAdmin(user);
    return this.volantesService.update(tenantId, id, dto);
  }

  // ADMIN → deletar volante
  @Delete(':id')
  remove(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    this.ensureAdmin(user);
    return this.volantesService.remove(tenantId, id);
  }
}