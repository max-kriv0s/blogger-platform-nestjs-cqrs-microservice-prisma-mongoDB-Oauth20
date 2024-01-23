import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '@gateway/src/features/post/db/post.repository';
import { Result } from '@gateway/src/core';
import { ForbiddenError, NotFoundError } from '@gateway/src/core';
import {
  ERROR_NOT_PERMITTED,
  ERROR_POST_NOT_FOUND,
} from '@gateway/src/features/post/post.constants';

export class DeletePostCommand {
  constructor(
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postRepo: PostRepository) {}

  async execute(command: DeletePostCommand) {
    const post = await this.postRepo.findById(command.postId);

    if (!post) {
      return Result.Err(new NotFoundError(ERROR_POST_NOT_FOUND));
    }

    if (command.userId !== post.authorId) {
      return Result.Err(new ForbiddenError(ERROR_NOT_PERMITTED));
    }

    const deleteResult = await this.postRepo.delete(command.postId);

    return deleteResult ? Result.Ok() : Result.Err(ERROR_POST_NOT_FOUND); //TODO: Do I return this
  }
}
