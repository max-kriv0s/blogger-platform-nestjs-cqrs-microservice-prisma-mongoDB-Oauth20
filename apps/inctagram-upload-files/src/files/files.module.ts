import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { FILES_USE_CASES } from './application';
import { S3StorageAdapter } from './adapters';

@Module({
  imports: [CqrsModule],
  controllers: [FilesController],
  providers: [S3StorageAdapter, ...FILES_USE_CASES],
})
export class FilesModule {}
