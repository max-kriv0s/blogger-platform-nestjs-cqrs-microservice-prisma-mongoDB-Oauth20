import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '@user/db';
import { CreateUserDto } from '@user/dto';
import { UserEntity } from '@user/entities';
import { UserService } from '@user/user.service';

export class CreateUserCommand {
  constructor(public userDto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly usersRepo: UserRepository,
  ) {}

  async execute({ userDto }: CreateUserCommand): Promise<any> {
    userDto.password = this.userService.generatePasswordHash(userDto.password);
    const newUser = UserEntity.create(userDto);
    return this.usersRepo.create(newUser);
  }
}
