import { Injectable } from '@nestjs/common';

@Injectable()
export class UserConfig {
  getConfirmationCodeLifetime() {
    return { hours: 1 };
  }
  getRecoveryCodeLifetime() {
    return { hours: 1 };
  }
}
