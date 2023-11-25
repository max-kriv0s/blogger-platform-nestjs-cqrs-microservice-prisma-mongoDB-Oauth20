import { Injectable } from '@nestjs/common';
import { AppConfig } from '../config/application';
import { EmailAdapter } from '../../infrastructure';
import {
  USER_CREATED_EVENT_NAME,
  UserInfoCreatedEvent,
  UserInfoUpdatedEvent,
} from '../../features/user/application/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailManagerService {
  private APP_URL: string;
  constructor(
    private readonly appConfig: AppConfig,
    private readonly emailAdapter: EmailAdapter,
  ) {
    this.APP_URL = appConfig.getFrontendEmailConfirmationUrl();
  }

  @OnEvent(USER_CREATED_EVENT_NAME)
  async sendEmailConfirmationMessage(payload: UserInfoCreatedEvent) {
    const textMessage = `<h1>Thank for your registration</h1>
          <p>To finish registration please follow the link below:
              <a href='${this.APP_URL}?code=${payload.configmationCode}'>complete registration</a>
          </p>`;

    await this.emailAdapter.sendEmail(
      payload.email,
      'Email confirmation',
      textMessage,
    );
  }

  @OnEvent('confirmationCode.updated')
  async sendPasswordRecoveryMessage(payload: UserInfoUpdatedEvent) {
    const textMessage = `<h1>Resending email confirmation</h1>
          <p>To finish registration please follow the link below:
              <a href='${this.APP_URL}?code=${payload.configmationCode}'>complete registration</a>
          </p>`;

    await this.emailAdapter.sendEmail(
      payload.email,
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
