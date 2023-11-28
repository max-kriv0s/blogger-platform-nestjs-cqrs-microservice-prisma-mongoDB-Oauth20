import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserIdType } from '../../features/user/types/userId.type';

export const CurrentUserInfo = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserIdType => {
    const request = context.switchToHttp().getRequest();

    return request.user as UserIdType;
  },
);
