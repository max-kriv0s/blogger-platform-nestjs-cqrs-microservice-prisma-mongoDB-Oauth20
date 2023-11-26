import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DEVICES_USE_CASES } from './application';

@Module({
  imports: [CqrsModule],
  providers: [...DEVICES_USE_CASES],
  exports: [],
})
export class DeviceModule {}
