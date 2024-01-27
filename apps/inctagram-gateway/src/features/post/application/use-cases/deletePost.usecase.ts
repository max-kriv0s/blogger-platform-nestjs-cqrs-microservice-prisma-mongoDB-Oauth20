import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '@gateway/src/features/post/db/post.repository';
import { Result } from '@gateway/src/core';
import { ForbiddenError, NotFoundError } from '@gateway/src/core';
import {
  ERROR_NOT_PERMITTED,
  ERROR_POST_NOT_FOUND,
} from '@gateway/src/features/post/post.constants';
import { DeleteFileCommand } from '@fileService/src/files/application';

export class DeletePostCommand {
  constructor(
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: DeletePostCommand) {
    const post = await this.postRepo.findById(command.postId);

    if (!post) {
      return Result.Err(new NotFoundError(ERROR_POST_NOT_FOUND));
    }

    if (command.userId !== post.authorId) {
      return Result.Err(new ForbiddenError(ERROR_NOT_PERMITTED));
    }

    await this.commandBus.execute(new DeleteFileCommand(post.imageId));
    await this.postRepo.delete(command.postId);

    return Result.Ok();
  }
}
