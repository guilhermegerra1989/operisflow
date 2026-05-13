import { Module } from '@nestjs/common';
import { OrdersController } from '../orders/orders.controller';
import { OrdersService } from '../orders/orders.service';
import { OrdersExportService } from '../orders/orders_export.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],           // 👈 aqui é a chave
  controllers: [OrdersController],
  providers: [OrdersService, OrdersExportService],
})
export class OrdersModule {}