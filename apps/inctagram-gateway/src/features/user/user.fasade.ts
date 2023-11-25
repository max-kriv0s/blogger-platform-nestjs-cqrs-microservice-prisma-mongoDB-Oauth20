import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto, UserPasswordRecoveryDto } from './dto';
import { UserQueryRepository } from './db/user.query.repository';
import { ResponseUserDto } from './responses';
import { User } from '@prisma/client';
import { Result } from '../../core/result';
import {
  ConfirmationRecoveryCodeCommand,
  ConfirmationRegistrationCommand,
  CreateUserCommand,
} from './application';
import { ConfirmationCodeDto, ConfirmationRecoveryCodeDto } from '../auth/dto';
import { UserPasswordRecoveryCommand } from './application/use-cases/userPasswordRecovery.usecase';

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
    passwordRecovery: (passwordRRecoveryDto: UserPasswordRecoveryDto) =>
      this.passwordRecovery(passwordRRecoveryDto),
    confirmationPasswordRecovery: (recoveryDto: ConfirmationRecoveryCodeDto) =>
      this.confirmationPasswordRecovery(recoveryDto),
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

  private async passwordRecovery(
    passwordRRecoveryDto: UserPasswordRecoveryDto,
  ): Promise<Result> {
    return this.commandBus.execute<UserPasswordRecoveryCommand, Result>(
      new UserPasswordRecoveryCommand(passwordRRecoveryDto),
    );
  }

  private async confirmationPasswordRecovery(
    recoveryDto: ConfirmationRecoveryCodeDto,
  ): Promise<Result> {
    return this.commandBus.execute<ConfirmationRecoveryCodeCommand, Result>(
      new ConfirmationRecoveryCodeCommand(recoveryDto),
    );
  }

  private async getUserViewById(id: string): Promise<Result<ResponseUserDto>> {
    return this.userQueryRepo.getUserViewById(id);
  }
}
