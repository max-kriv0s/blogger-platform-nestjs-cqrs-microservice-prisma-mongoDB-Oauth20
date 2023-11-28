import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserUseCase } from './createUser.usecase';
import { ConfirmationRegistrationUseCase } from './confirmationRegistration.usecase';
import { UserPasswordRecoveryUseCase } from './userPasswordRecovery.usecase';
import { NewPasswordUseCase } from './newPassword.usecase';
import { CheckUserCredentialsUseCase } from './checkUserCredentials';

export * from './createUser.usecase';
export * from './confirmationRegistration.usecase';
export * from './userPasswordRecovery.usecase';
export * from './newPassword.usecase';
export * from './checkUserCredentials';

export const USER_USE_CASES: Type<ICommandHandler>[] = [
  CreateUserUseCase,
  ConfirmationRegistrationUseCase,
  UserPasswordRecoveryUseCase,
  NewPasswordUseCase,
  CheckUserCredentialsUseCase,
];
