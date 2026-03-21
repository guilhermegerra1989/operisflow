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

import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from '../marcas/dto/create-marca.dto';
import { UpdateMarcaDto } from '../marcas/dto/update-marca.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Tenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('marcas')
@UseGuards(JwtAuthGuard)
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  private ensureAdmin(user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem modificar marcas');
    }
  }

  // ADMIN → criar marca
  @Post()
  create(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateMarcaDto,
  ) {
    this.ensureAdmin(user);
    return this.marcasService.create(tenantId, dto);
  }

  // CLIENTE + ADMIN → lista de marcas
  @Get()
  findAll(@Tenant() tenantId: string) {
    return this.marcasService.findAll(tenantId);
  }

  // ADMIN → editar marca
  @Patch(':id')
  update(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateMarcaDto,
  ) {
    this.ensureAdmin(user);
    return this.marcasService.update(tenantId, id, dto);
  }

  // ADMIN → deletar marca
  @Delete(':id')
  remove(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    this.ensureAdmin(user);
    return this.marcasService.remove(tenantId, id);
  }
}