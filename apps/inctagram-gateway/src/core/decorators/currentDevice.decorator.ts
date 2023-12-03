import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { InternalServerError } from '../exceptions';
import { DeviceInfo } from '../../features/device/types/deviceInfo.type';

export const CurrentDevice = createParamDecorator(
  (data: unknown, context: ExecutionContext): DeviceInfo => {
    const request = context.switchToHttp().getRequest();
    if (request.user || request.user.deviceId)
      throw new InternalServerError('Haven`t deviceId in request');

    const { deviceId, lastActiveDate, expirationDate } = request.user;

    return { deviceId, lastActiveDate, expirationDate };
  },
);
