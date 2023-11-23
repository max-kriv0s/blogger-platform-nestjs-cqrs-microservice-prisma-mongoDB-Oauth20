import { Injectable } from '@nestjs/common';
import { AppConfig } from '../config/application';
import { EmailAdapter } from '../../infrastructure';
import { UserCreatedEvent } from '../../features/user/application/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailManagerService {
  private APP_URL: string;
  constructor(
    private readonly appConfig: AppConfig,
    private readonly emailAdapter: EmailAdapter,
  ) {
    this.APP_URL = appConfig.getAppUrl();
  }

  @OnEvent('user.created')
  async sendEmailConfirmationMessage(payload: UserCreatedEvent) {
    const textMessage = `<h1>Thank for your registration</h1>
          <p>To finish registration please follow the link below:
              <a href='${this.APP_URL}/confirm-email?code=${payload.configmationCode}'>complete registration</a>
          </p>`;

    await this.emailAdapter.sendEmail(
      payload.email,
      'Email confirmation',
      textMessage,
    );
  }

  async sendPasswordRecoveryMessage(email: string, confirmationCode: string) {
    const textMessage = `<h1>Resending email confirmation</h1>
          <p>To finish registration please follow the link below:
              <a href='${this.APP_URL}/confirm-email?code=${confirmationCode}'>complete registration</a>
          </p>`;

    await this.emailAdapter.sendEmail(
      email,
      'Resending email confirmation',
      textMessage,
    );
  }

  async sendPasswordRecovery(email: string, recoveryCode: string) {
    const textMessage = `<h1>Password recovery</h1>
          <p>To finish password recovery please follow the link below:
              <a href='${this.APP_URL}/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
          </p>`;

    await this.emailAdapter.sendEmail(email, 'Password recovery', textMessage);
  }
}
