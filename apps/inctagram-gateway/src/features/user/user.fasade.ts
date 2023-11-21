import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dto';
import { CreateUserCommand } from './application/use-cases/createUser.usecase';
import { UserQueryRepository } from './db/user.query.repository';
import { ResponseUserDto } from './responses';
import { User } from '@prisma/client';

@Injectable()
export class UserFasade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userQueryRepo: UserQueryRepository,
  ) {}
  useCases = {
    createUser: (userDto: CreateUserDto) => this.createUser(userDto),
  };
  queries = { getUserViewById: (id: string) => this.getUserViewById(id) };

  private async createUser(userDto: CreateUserDto): Promise<User> {
    return this.commandBus.execute(new CreateUserCommand(userDto));
  }

  private async getUserViewById(id: string): Promise<ResponseUserDto> {
    return this.userQueryRepo.getUserViewById(id);
  }
}
