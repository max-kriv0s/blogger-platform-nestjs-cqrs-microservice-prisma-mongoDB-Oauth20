import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRegistrationInfoRepository } from './db';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UserConfig } from './config';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRegistrationInfoRepo: UserRegistrationInfoRepository,
    private readonly userConfig: UserConfig,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  generatePasswordHash(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  isCorrectPassword(password: string, hashPassword: string): boolean {
    return bcrypt.compareSync(password, hashPassword);
  }

  generateConfirmationCode(): {
    code: string;
    expiration: Date;
  } {
    return {
      code: uuidv4(),
      expiration: add(
        new Date(),
        this.userConfig.getConfirmationCodeLifetime(),
      ),
    };
  }

}
