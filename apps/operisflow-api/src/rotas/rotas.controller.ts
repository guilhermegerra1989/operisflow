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

import { RotasService } from './rotas.service';
import { CreateRotaDto } from './dto/create-rota.dto';
import { UpdateRotaDto } from './dto/update-rota.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Tenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('rotas')
@UseGuards(JwtAuthGuard)
export class RotasController {
  constructor(private readonly rotasService: RotasService) {}

  private ensureAdmin(user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem modificar rotas');
    }
  }

  // ADMIN → criar rota
  @Post()
  create(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateRotaDto,
  ) {
    this.ensureAdmin(user);
    return this.rotasService.create(tenantId, dto);
  }

  // CLIENTE + ADMIN → lista de rotas
  @Get()
  findAll(@Tenant() tenantId: string) {
    return this.rotasService.findAll(tenantId);
  }

  // ADMIN → editar rota
  @Patch(':id')
  update(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateRotaDto,
  ) {
    this.ensureAdmin(user);
    return this.rotasService.update(tenantId, id, dto);
  }

  // ADMIN → deletar rota
  @Delete(':id')
  remove(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    this.ensureAdmin(user);
    return this.rotasService.remove(tenantId, id);
  }
}