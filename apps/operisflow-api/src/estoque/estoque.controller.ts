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

import { EstoqueService } from './estoque.service';
import { CreateEstoqueDto } from './dto/create-estoque.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Tenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('estoque')
@UseGuards(JwtAuthGuard)
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  private ensureAdmin(user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem modificar estoque');
    }
  }

  @Post()
  create(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateEstoqueDto,
  ) {
    return this.estoqueService.create(tenantId, dto);
  }

  // CLIENTE + ADMIN → lista de estoque
  @Get()
  findAll(@Tenant() tenantId: string) {
    return this.estoqueService.findAll(tenantId);
  }

  // ADMIN → editar estoque
  @Patch(':id')
  update(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CreateEstoqueDto,
  ) {
    this.ensureAdmin(user);
    return this.estoqueService.update(tenantId, id, dto);
  }

  // ADMIN → deletar estoque
  @Delete(':id')
  remove(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.estoqueService.remove(tenantId, id);
  }

  @Delete()
  removeAll(@Tenant() tenantId: string) {
    return this.estoqueService.removeAllByTenant(tenantId);
  }

}