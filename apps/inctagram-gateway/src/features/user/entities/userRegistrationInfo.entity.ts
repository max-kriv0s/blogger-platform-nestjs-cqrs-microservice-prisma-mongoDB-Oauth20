import { UserRegistrationInfo } from '@prisma/client';

export class UserRegistrationInfoEntity implements UserRegistrationInfo {
  id: string;
  userId: string;
  isConfirmed: boolean;
  confirmationCode: string;
  expirationConfirmationCode: Date;
  recoveryCode: string;
  expirationRecoveryCode: Date;

  private constructor(userId: string) {
    this.userId = userId;
  }

  static createConfirmationCode(userId: string) {
    const userRegistration = new UserRegistrationInfoEntity(userId);
    return userRegistration;
  }
}
