import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmationRecoveryCodeDto } from '../../../auth/dto';
import { Result } from '../../../../core/result';
import { validateOrRejectModel } from '../../../../core/config';
import { UserRegistrationInfoRepository } from '../../db';
import { BadRequestError } from '../../../../core/exceptions';
import { ERROR_INCORRECT_RECOVER_CODE } from '../../user.constants';

export class ConfirmationRecoveryCodeCommand {
  constructor(public recoveryDto: ConfirmationRecoveryCodeDto) {}
}

@CommandHandler(ConfirmationRecoveryCodeCommand)
export class ConfirmationRecoveryCodeUseCase
  implements ICommandHandler<ConfirmationRecoveryCodeCommand>
{
  constructor(
    private readonly userRegistrationInfoRepo: UserRegistrationInfoRepository,
  ) {}
  async execute({
    recoveryDto,
  }: ConfirmationRecoveryCodeCommand): Promise<Result> {
    await validateOrRejectModel(recoveryDto, ConfirmationRecoveryCodeDto);

    const userInfo = await this.userRegistrationInfoRepo.findByRecoveryCode(
      recoveryDto.recoveryCode,
    );

    if (!userInfo || userInfo.expirationRecoveryCode < new Date()) {
      return Result.Err(
        new BadRequestError(ERROR_INCORRECT_RECOVER_CODE, 'recoveryCode'),
      );
    }

    return Result.Ok();
  }
}
