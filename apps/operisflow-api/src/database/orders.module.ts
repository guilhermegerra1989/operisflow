import { Module } from '@nestjs/common';
import { OrdersController } from '../orders/orders.controller';
import { OrdersService } from '../orders/orders.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],           // 👈 aqui é a chave
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}