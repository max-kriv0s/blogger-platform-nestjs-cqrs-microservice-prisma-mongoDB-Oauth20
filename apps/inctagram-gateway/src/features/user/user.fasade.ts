import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto, NewPasswordDto, UserPasswordRecoveryDto } from './dto';
import { UserQueryRepository } from './db/user.query.repository';
import { ResponseUserDto } from './responses';
import { User } from '@prisma/client';
import { Result } from '../../core/result';
import {
  ConfirmationRegistrationCommand,
  CreateUserCommand,
  NewPasswordCommand,
} from './application';
import { ConfirmationCodeDto } from '../auth/dto';
import { CheckUserCredentialsCommand } from './application/use-cases/checkUserCredentials';
import { LoginDto } from '../auth/dto/login.dto';
import { UserIdType } from './types/userId.type';
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
    checkUserCredentials: (loginDto: LoginDto): Promise<Result<UserIdType>> =>
      this.checkUserCredentials(loginDto),
    passwordRecovery: (passwordRRecoveryDto: UserPasswordRecoveryDto) =>
      this.passwordRecovery(passwordRRecoveryDto),
    newPassword: (dto: NewPasswordDto) => this.newPassword(dto),
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

  private async passwordRecovery(
    passwordRRecoveryDto: UserPasswordRecoveryDto,
  ): Promise<Result> {
    return this.commandBus.execute<UserPasswordRecoveryCommand, Result>(
      new UserPasswordRecoveryCommand(passwordRRecoveryDto),
    );
  }

  private async newPassword(dto: NewPasswordDto): Promise<Result> {
    return this.commandBus.execute<NewPasswordCommand, Result>(
      new NewPasswordCommand(dto),
    );
  }

  private async getUserViewById(id: string): Promise<Result<ResponseUserDto>> {
    return this.userQueryRepo.getUserViewById(id);
  }
}
