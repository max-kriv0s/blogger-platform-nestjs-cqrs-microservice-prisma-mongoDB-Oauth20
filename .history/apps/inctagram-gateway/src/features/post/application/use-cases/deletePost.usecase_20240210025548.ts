import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepository } from '@gateway/src/features/post/db/post.repository';
import { BadGatewayError, Result } from '@gateway/src/core';
import { ForbiddenError, NotFoundError } from '@gateway/src/core';
import {
  ERROR_NOT_PERMITTED,
  ERROR_POST_NOT_FOUND,
} from '@gateway/src/features/post/post.constants';
import { PrismaService } from '@gateway/src/core/prisma/prisma.servise';
import { firstValueFrom, timeout } from 'rxjs';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ERROR_DELETE_FILE } from '@gateway/src/features/user/user.constants';

export class DeletePostCommand {
  constructor(
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  logger = new Logger(DeletePostUseCase.name);

  constructor(
    private readonly postRepo: PostRepository,
    private readonly prismaService: PrismaService,
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
  ) {}

  async execute(command: DeletePostCommand) {
    const post = await this.postRepo.findById(command.postId);

    if (!post) {
      return Result.Err(new NotFoundError(ERROR_POST_NOT_FOUND));
    }

    if (command.userId !== post.authorId) {
      return Result.Err(new ForbiddenError(ERROR_NOT_PERMITTED));
    }

    const deleteResult = await this.prismaService.$transaction(
      async (transactionClient) => {
        const deletePostResponse = await transactionClient.post.delete({
          where: { id: command.postId },
        });

        if (!deletePostResponse) {
          throw new NotFoundError(ERROR_POST_NOT_FOUND);
        }

        let isSuccess = false;

        try {
          const responseOfService = this.fileServiceClient
            .send({ cmd: 'delete_file' }, { fileId: post.imageId })
            .pipe(timeout(10000));
          const deletionResult = await firstValueFrom(responseOfService);
          isSuccess = deletionResult.isSuccess;
        } catch (error) {
          this.logger.error(error);
          return Result.Err(new BadGatewayError(ERROR_DELETE_FILE));
        }

        if (!isSuccess) {
          return Result.Err(new BadGatewayError(ERROR_DELETE_FILE));
        }

        return deletePostResponse;
      },
    );

    if (!deleteResult) {
      return Result.Err(new NotFoundError('temporary for check'));
    }

    return Result.Ok();
  }
}

//sdsd
///fdvxfvxvf
//dfgdggd
