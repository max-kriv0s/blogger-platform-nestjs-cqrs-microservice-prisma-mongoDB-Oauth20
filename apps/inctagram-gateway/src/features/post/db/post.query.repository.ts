import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { NotFoundError, Result } from '../../../core';
import { ResponsePostDto } from '@gateway/src/features/post/responses/responsePost.dto';
import { ERROR_POST_NOT_FOUND } from '@gateway/src/features/post/post.constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { FilesUrlResponse } from '@libs/contracts';

@Injectable()
export class PostQueryRepository {
  private logger = new Logger(PostQueryRepository.name);

  constructor(
    private readonly prismaService: PrismaService,
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
  ) {}

  async getPostViewById(
    id: string,
    userId: string,
  ): Promise<Result<ResponsePostDto>> {
    const post = await this.prismaService.post.findUnique({
      where: { id, isDeleted: false, authorId: userId },
      include: { images: true },
    });

    if (!post) {
      return Result.Err(new NotFoundError(ERROR_POST_NOT_FOUND));
    }

    const ids = post.images.map((image) => image.imageId);

    try {
      const responseOfService = this.fileServiceClient
        .send({ cmd: 'get_files_url' }, { ids })
        .pipe(timeout(10000));
      const response: FilesUrlResponse = await firstValueFrom(
        responseOfService,
      );

      return Result.Ok(ResponsePostDto.getView(post, response.urls));
    } catch (error) {
      this.logger.log(`userId: ${id} - ${error}`);
      return Result.Ok(ResponsePostDto.getView(post));
    }
  }
}
