import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events';
import { UserConfig } from '../../config';
import { UserRepository } from '../../db';
import { UserRegistrationInfoRepository } from '../../db/userRegistrationInfo.repository';
import { CreateUserDto, CreateUserInfoDto } from '../../dto';
import { UserService } from '../../user.service';
import { validateOrRejectModel } from '../../../../core/config';
import { Result } from '../../../../core/result';
import { BadRequestError } from '../../../../core/exceptions';
import {
  ERROR_EMAIL_IS_ALREADY_REGISTRED,
  ERROR_USERNAME_IS_ALREADY_REGISTRED,
} from '../../user.constants';

export class CreateUserCommand {
  constructor(public userDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userConfig: UserConfig,
    private readonly userService: UserService,
    private readonly userRepo: UserRepository,
    private readonly userRegistrationInfoRepo: UserRegistrationInfoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute({ userDto }: CreateUserCommand): Promise<any> {
    await validateOrRejectModel(userDto, CreateUserDto);

    const userByEmail = await this.userRepo.findByUsernameOrEmail(
      userDto.email,
    );
    if (userByEmail) {
      return Result.Err(
        new BadRequestError(ERROR_EMAIL_IS_ALREADY_REGISTRED, 'email'),
      );
    }

    const userByLogin = await this.userRepo.findByUsernameOrEmail(
      userDto.username,
    );
    if (userByLogin) {
      return Result.Err(
        new BadRequestError(ERROR_USERNAME_IS_ALREADY_REGISTRED, 'username'),
      );
    }

    userDto.password = this.userService.generatePasswordHash(userDto.password);
    const createdUser = await this.userRepo.create(userDto);

    const userInfo: CreateUserInfoDto = {
      userId: createdUser.id,
      confirmationCode: uuidv4(),
      expirationConfirmationCode: add(
        new Date(),
        this.userConfig.getConfirmationCodeLifetime(),
      ),
    };

    await this.userRegistrationInfoRepo.create(userInfo);
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(createdUser.email, userInfo.confirmationCode),
    );

    return Result.Ok(createdUser);
  }
}
