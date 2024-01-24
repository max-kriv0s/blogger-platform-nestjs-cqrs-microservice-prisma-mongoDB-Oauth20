import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { NotFoundError, Result } from '../../../core';
import { ResponsePostDto } from '@gateway/src/features/post/responses/responsePost.dto';
import { ERROR_POST_NOT_FOUND } from '@gateway/src/features/post/post.constants';

@Injectable()
export class PostQueryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getPostViewById(id: string): Promise<Result<ResponsePostDto>> {
    const post = await this.prismaService.post.findUnique({
      where: { id, isDeleted: false },
    });

    if (!post) {
      return Result.Err(new NotFoundError(ERROR_POST_NOT_FOUND));
    }

    // TODO - тут нужен запрос на файловый сервис за image url

    return Result.Ok(ResponsePostDto.getView(post));
  }
}
