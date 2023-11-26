import { CommandBus } from '@nestjs/cqrs';
import { CreateDeviceCommand } from './application';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeviceFacade {
  constructor(
    private readonly commandBus: CommandBus, // private readonly deviceQueryRepo: DeviceQueryRepository,
  ) {}

  useCases = {
    createDevice: (deviceDto) => this.createDevice(deviceDto),
  };

  private async createDevice(deviceDto) {
    return this.commandBus.execute<CreateDeviceCommand>(
      new CreateDeviceCommand(deviceDto),
    );
  }
}
