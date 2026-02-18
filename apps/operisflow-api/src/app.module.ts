import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VolantesModule } from './volantes/volantes.module';

@Module({
  imports: [
    AuthModule,
    OrdersModule,
    UsersModule, 
    VolantesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}