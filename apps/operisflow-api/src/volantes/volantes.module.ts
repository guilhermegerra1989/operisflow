import { Module } from '@nestjs/common';
import { VolantesController } from './volantes.controller';
import { VolantesService } from './volantes.service';

@Module({
  controllers: [VolantesController],
  providers: [VolantesService],
  exports: [VolantesService],
})
export class VolantesModule {}