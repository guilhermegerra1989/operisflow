import { Module } from '@nestjs/common';
import { OrdersController } from '../orders/orders.controller';
import { OrdersService } from '../orders/orders.service';
import { OrdersExportService } from '../orders/orders_export.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersExportService],
})
export class OrdersModule {}