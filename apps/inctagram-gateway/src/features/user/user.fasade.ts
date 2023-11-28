import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dto';
import { UserQueryRepository } from './db/user.query.repository';
import { ResponseUserDto } from './responses';
import { User } from '@prisma/client';
import { Result } from '../../core/result';
import {
  ConfirmationRegistrationCommand,
  CreateUserCommand,
} from './application';
import { ConfirmationCodeDto } from '../auth/dto';
import { CheckUserCredentialsCommand } from './application/use-cases/checkUserCredentials';
import { LoginDto } from '../auth/dto/login.dto';
import { UserIdType } from './types/userId.type';

@Injectable()
export class UserFasade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userQueryRepo: UserQueryRepository,
  ) {}

  useCases = {
    createUser: (userDto: CreateUserDto) => this.createUser(userDto),
    confirmationRegistration: (confirmDto: ConfirmationCodeDto) =>
      this.confirmationRegistration(confirmDto),
    checkUserCredentials: (loginDto: LoginDto): Promise<Result<UserIdType>> =>
      this.checkUserCredentials(loginDto),
  };
  queries = { getUserViewById: (id: string) => this.getUserViewById(id) };

  private async createUser(userDto: CreateUserDto): Promise<Result<User>> {
    return this.commandBus.execute<CreateUserCommand, Result<User>>(
      new CreateUserCommand(userDto),
    );
  }

  private async confirmationRegistration(
    confirmDto: ConfirmationCodeDto,
  ): Promise<Result<boolean>> {
    return this.commandBus.execute<
      ConfirmationRegistrationCommand,
      Result<boolean>
    >(new ConfirmationRegistrationCommand(confirmDto));
  }

  private async checkUserCredentials(loginDto: LoginDto) {
    return this.commandBus.execute<
      CheckUserCredentialsCommand,
      Result<UserIdType>
    >(new CheckUserCredentialsCommand(loginDto));
  }

  private async getUserViewById(id: string): Promise<Result<ResponseUserDto>> {
    return this.userQueryRepo.getUserViewById(id);
  }
}
