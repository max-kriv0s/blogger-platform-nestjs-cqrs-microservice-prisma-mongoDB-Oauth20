import { UserRegistrationInfo } from '@prisma/client';

export type CreateUserInfoDto = Pick<
  UserRegistrationInfo,
  'userId' | 'confirmationCode' | 'expirationConfirmationCode'
>;
