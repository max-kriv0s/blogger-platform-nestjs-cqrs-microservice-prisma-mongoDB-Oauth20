import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class PostFacade {
  constructor(private commandBus: CommandBus) {}

  repository = {};

  useCases = {
    updatePost: (updatePostDto: CreateUserDto) => this.updatePost(userDto),
  };
  queries = { getUserViewById: (id: string) => this.getUserViewById(id) };

  private async updatePost(
    updatePostDto: CreateUserDto,
  ): Promise<Result<string>> {
    return this.commandBus.execute<UpdatePostCommand, Result<string>>(
      new UpdatePostCommand(updatePostDto),
    );
  }
}
