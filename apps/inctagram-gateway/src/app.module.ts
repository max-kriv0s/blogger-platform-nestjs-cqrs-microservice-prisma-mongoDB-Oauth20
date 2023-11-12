import { Module } from '@nestjs/common';
import { PrismaService } from './core';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
