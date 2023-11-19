import { Module } from '@nestjs/common';
import { PrismaService } from './core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}

console.log('db url:', process.env.DATABASE_URL);
