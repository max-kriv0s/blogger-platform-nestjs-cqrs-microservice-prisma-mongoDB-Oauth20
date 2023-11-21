import { Module } from '@nestjs/common';
import { UserFasade } from './user.fasade';
import { CqrsModule } from '@nestjs/cqrs';
import { USER_USE_CASES } from './application/use-cases';
import { UserQueryRepository, UserRepository } from './db';
import { UserService } from './user.service';

@Module({
  imports: [CqrsModule],
  providers: [
    ...USER_USE_CASES,
    UserRepository,
    UserQueryRepository,
    UserService,
    UserFasade,
  ],
  exports: [UserFasade],
})
export class UserModule {}
