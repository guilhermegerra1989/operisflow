import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],  // 👈 isso aqui é crucial
})
export class DatabaseModule {}