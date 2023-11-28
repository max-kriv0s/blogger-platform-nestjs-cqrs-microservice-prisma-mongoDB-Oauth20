import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../user.service';
import { UserRepository } from '../../db';
import { UserIdType } from '../../types/userId.type';
import { Result, UnauthorizedError } from '../../../../core';
import {
  ERROR_PASSWORD_IS_WRONG,
  ERROR_USER_NOT_CONFIRMED,
  USER_NOT_FOUND,
} from '../../user.constants';
import { LoginDto } from '../../../auth/dto/login.dto';

export class CheckUserCredentialsCommand {
  constructor(public loginDto: LoginDto) {}
}

@CommandHandler(CheckUserCredentialsCommand)
export class CheckUserCredentialsUseCase
  implements ICommandHandler<CheckUserCredentialsCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute({
    loginDto,
  }: CheckUserCredentialsCommand): Promise<Result<UserIdType>> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    //console.log('user in check credentials:', user);
    // check there is user or not
    if (!user) return Result.Err(new UnauthorizedError(USER_NOT_FOUND));
    //check user password
    const isMatched = this.userService.isCorrectPassword(
      loginDto.password,
      user.hashPassword,
    );
    if (!isMatched)
      return Result.Err(new UnauthorizedError(ERROR_PASSWORD_IS_WRONG));

    if (!user.userRegistrationInfo.isConfirmed)
      return Result.Err(new UnauthorizedError(ERROR_USER_NOT_CONFIRMED));

    return Result.Ok({ userId: user.id });
  }
}
