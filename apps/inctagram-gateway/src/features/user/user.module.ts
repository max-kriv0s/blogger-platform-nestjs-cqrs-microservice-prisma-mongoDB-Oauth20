import { Module } from '@nestjs/common';
import { UserFasade } from './user.fasade';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_USE_CASES } from './application/use-cases';
import { UserQueryRepository, UserRepository } from './db';
import { UserService } from './user.service';
import { UserRegistrationInfoRepository } from './db/userRegistrationInfo.repository';
import { UserConfig } from './config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IsPasswordsMatchingConstraint } from './decorators';

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
  ],
  exports: [UserFasade],
})
export class UserModule {}
