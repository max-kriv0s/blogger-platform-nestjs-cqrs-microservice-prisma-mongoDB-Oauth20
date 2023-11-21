import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserUseCase } from './createUser.usecase';

export * from './createUser.usecase';

export const USER_USE_CASES: Type<ICommandHandler>[] = [CreateUserUseCase];
