import { Module } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { CqrsModule } from '@nestjs/cqrs';
import { UserQueryRepository, UserRepository } from './db';
import { UserService } from './user.service';
import { UserConfig } from './config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  IsPasswordMustContain,
  IsPasswordsMatchingConstraint,
} from './decorators';
import { USER_USE_CASES } from './application';
import { ClientsModule } from '@nestjs/microservices';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FILE_SERVICE',
        options: {
          port: 3000,
        },
      },
    ]),
    CqrsModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [
    UserConfig,
    ...USER_USE_CASES,
    UserRepository,
    UserQueryRepository,
    UserService,
    UserFacade,
    IsPasswordsMatchingConstraint,
    IsPasswordMustContain,
  ],
  exports: [UserFacade],
  controllers: [UserController],
})
export class UserModule {}
