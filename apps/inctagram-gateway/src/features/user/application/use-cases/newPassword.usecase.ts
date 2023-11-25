import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordDto } from '../../dto';
import { UserRegistrationInfoRepository, UserRepository } from '../../db';
import { validateOrRejectModel } from '../../../../core/config';
import { Result } from '../../../../core/result';
import { BadRequestError } from '../../../../core/exceptions';
import { ERROR_INCORRECT_RECOVER_CODE } from '../../user.constants';
import { UserService } from '../../user.service';

export class NewPasswordCommand {
  constructor(public dto: NewPasswordDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly userRegistrationInfoRepo: UserRegistrationInfoRepository,
    private readonly userService: UserService,
  ) {}

  async execute({ dto }: NewPasswordCommand): Promise<Result> {
    await validateOrRejectModel(dto, NewPasswordDto);

    const userInfo = await this.userRegistrationInfoRepo.findByRecoveryCode(
      dto.recoveryCode,
    );

    if (!userInfo) {
      return Result.Err(
        new BadRequestError(ERROR_INCORRECT_RECOVER_CODE, dto.recoveryCode),
      );
    }

    const newHashPassword = this.userService.generatePasswordHash(
      dto.newPassword,
    );
    await this.userRepo.update(userInfo.userId, {
      hashPassword: newHashPassword,
    });
    return Result.Ok();
  }
}
