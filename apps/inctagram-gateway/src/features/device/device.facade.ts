import { CommandBus } from '@nestjs/cqrs';
import {
  CheckDeviceCredentialsCommand,
  CreateDeviceCommand,
  DeleteDeviceCommand,
} from './application';
import { Injectable } from '@nestjs/common';
import { DeviceDto } from './dto';
import { Result } from '../../core';
import { CreateTokensType } from './types/createTokens.type';
import { DeviceInfo } from './types/deviceInfo.type';
import { UserId } from '../user/types';

@Injectable()
export class DeviceFacade {
  constructor(
    private readonly commandBus: CommandBus, // private readonly deviceQueryRepo: DeviceQueryRepository,
  ) {}

  useCases = {
    createDevice: (deviceDto: DeviceDto): Promise<Result<CreateTokensType>> =>
      this.createDevice(deviceDto),

    checkDeviceCredentials: (
      devicePayload: DeviceInfo & UserId,
    ): Promise<Result> => this.checkDeviceCredentials(devicePayload),

    deleteDeviceByIdAndUserId: (
      userId: string,
      deviceId: string,
    ): Promise<Result> => this.deleteDeviceByIdAndUserId(userId, deviceId),
  };

  private async createDevice(
    deviceDto: DeviceDto,
  ): Promise<Result<CreateTokensType>> {
    return this.commandBus.execute<
      CreateDeviceCommand,
      Result<CreateTokensType>
    >(new CreateDeviceCommand(deviceDto));
  }

  private async checkDeviceCredentials(
    devicePayload: DeviceInfo & UserId,
  ): Promise<Result> {
    return this.commandBus.execute<CheckDeviceCredentialsCommand, Result>(
      new CheckDeviceCredentialsCommand(devicePayload),
    );
  }

  private async deleteDeviceByIdAndUserId(
    userId: string,
    deviceId: string,
  ): Promise<Result> {
    return this.commandBus.execute<DeleteDeviceCommand, Result>(
      new DeleteDeviceCommand(userId, deviceId),
    );
  }
}
