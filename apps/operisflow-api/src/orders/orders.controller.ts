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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/curret-user.decorator';
import { Tenant } from '../common/decorators/tenant.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard) // 👈 todas as rotas daqui exigem JWT
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // CLIENTE e ADMIN → criar pedido (mas na prática só o client vai usar)
  @Post()
  create(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.create(tenantId, user.id, dto);
  }

  // CLIENTE → vê só os próprios pedidos
  @Get('my')
  findMyOrders(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.findMyOrders(tenantId, user.id);
  }

  // ADMIN → vê todos os pedidos do tenant
  @Get()
  findAll(
    @Tenant() tenantId: string,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'admin') {
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

  // ADMIN → alterar pedido (ex: status)
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
}