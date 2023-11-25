import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserUseCase } from './createUser.usecase';
import { ConfirmationRegistrationUseCase } from './confirmationRegistration.usecase';
import { UserPasswordRecoveryUseCase } from './userPasswordRecovery.usecase';

export * from './createUser.usecase';
export * from './confirmationRegistration.usecase';
export * from './userPasswordRecovery.usecase';
export * from './confirmationRecoveryCode.usecase';

export const USER_USE_CASES: Type<ICommandHandler>[] = [
  CreateUserUseCase,
  ConfirmationRegistrationUseCase,
  UserPasswordRecoveryUseCase,
  ConfirmationRegistrationUseCase,
];
