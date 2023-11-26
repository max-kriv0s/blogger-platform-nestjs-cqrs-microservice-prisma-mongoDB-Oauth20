import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DEVICES_USE_CASES } from './application';
import { DeviceFacade } from './device.facade';

@Module({
  imports: [CqrsModule],
  providers: [...DEVICES_USE_CASES, DeviceFacade],
  exports: [],
})
export class DeviceModule {}
