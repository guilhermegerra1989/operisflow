import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  ForbiddenException,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersExportService } from './orders_export.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ExportEstoqueDto } from './dto/export-estoque.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Tenant } from '../common/decorators/tenant.decorator';
import type { Response } from "express";


@Controller('orders')
@UseGuards(JwtAuthGuard) // 👈 todas as rotas daqui exigem JWT
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly ordersExportService: OrdersExportService) {}

  // CLIENTE e ADMIN → criar pedido (mas na prática só o client vai usar)
  @Post()
  create(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(tenantId, user.sub, dto);
  }

  // CLIENTE → vê só os próprios pedidos
  @Get('my')
  findMyOrders(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.findMyOrders(tenantId, user.sub);
  }

  // ADMIN → vê todos os pedidos do tenant
  @Get()
  findAll(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'admin' && user.role !== 'operator') {
      throw new ForbiddenException('Apenas administrador pode listar todos os pedidos');
    }
    return this.ordersService.findAll(tenantId);
  }

  @Get(':id')
  findOne(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    // Aqui você pode decidir regra: admin vê tudo, client vê só sendo dono, etc.
    return this.ordersService.findOne(tenantId, id);
  }

 @Patch(':id')
  update(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Apenas administrador pode atualizar pedidos');
    }

    // ✅ CASO: apenas mudança de status (finalizar pedido)
    if (dto.status && Object.keys(dto).length === 1) {
      return this.ordersService.updateStatus(tenantId, id, dto.status);
    }

    // ✅ CASO: update "completo"
    return this.ordersService.update(tenantId, id, dto);
  }

  // ADMIN → remover pedido
  @Delete(':id')
  remove(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Apenas administrador pode remover pedidos');
    }
    return this.ordersService.remove(tenantId, id);
  }



  
// ✅ EXPORTAÇÃO DE ORDER (FINAL)
  @Post('export')
  async exportOrder(@Body() order: any, @Res() res: Response) {
    const fileBuffer =
      await this.ordersExportService.generateOrderExcel(order);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=order-${order.orderNumber}.xlsx`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.end(fileBuffer);
  }


 // ✅ EXPORTAÇÃO DE ESTOQUE
  @Post('export-estoque')
  async exportEstoque( @Body() dto: ExportEstoqueDto, @Res() res: Response) {
    const fileBuffer =
      await this.ordersExportService.generateEstoqueExcel(dto.estoque);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=estoque.xlsx`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.end(fileBuffer);
  }


}