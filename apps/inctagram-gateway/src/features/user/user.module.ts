import { Module } from '@nestjs/common';
import { UserFasade } from './user.fasade';
import { CqrsModule } from '@nestjs/cqrs';
import { UserQueryRepository, UserRepository } from './db';
import { UserService } from './user.service';
import { UserRegistrationInfoRepository } from './db/userRegistrationInfo.repository';
import { UserConfig } from './config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  IsPasswordMustContain,
  IsPasswordsMatchingConstraint,
} from './decorators';
import { USER_USE_CASES } from './application';

@Module({
  imports: [CqrsModule, EventEmitterModule.forRoot()],
  providers: [
    UserConfig,
    ...USER_USE_CASES,
    UserRepository,
    UserQueryRepository,
    UserRegistrationInfoRepository,
    UserService,
    UserFasade,
    IsPasswordsMatchingConstraint,
    IsPasswordMustContain,
  ],
  exports: [UserFasade],
})
export class UserModule {}
