import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '@user/db';
import { UserRegistrationInfoRepository } from '@user/db/userRegistrationInfo.repository';
import { CreateUserDto, CreateUserInfoDto } from '@user/dto';
import { UserService } from '@user/user.service';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UserConfig } from '@user/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events';

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

    return createdUser;
  }
}
