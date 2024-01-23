import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePostDto } from '@gateway/src/features/post/dto/updatePost.dto';
import { CurrentUserId } from '@gateway/src/core/decorators/currentUserId.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePostCommand } from '@gateway/src/features/post/application/use-cases/updatePost.usecase';
import { AccessTokenGuard } from '@gateway/src/features/auth/guards/accessJwt.guard';
import { Result } from '../../../core';
import { PostQueryRepository } from '@gateway/src/features/post/db/post.query.repository';
import { UpdatePostSwaggerDecorator } from '@gateway/src/core/swagger/post/updatePost.swagger.decorator';

@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('post')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly postQueryRepo: PostQueryRepository,
  ) {}

  @ApiOperation({
    summary: 'Editing Post',
  })
  @UpdatePostSwaggerDecorator()
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUserId() userId: string,
  ) {
    const updateResult = await this.commandBus.execute<
      UpdatePostCommand,
      Result
    >(new UpdatePostCommand(postId, updatePostDto, userId));

    if (!updateResult.isSuccess) throw updateResult.err;

    const postViewResult = await this.postQueryRepo.getPostViewById(postId);

    if (!postViewResult.isSuccess) {
      throw postViewResult.err;
    }
    return postViewResult.value;
  }
}
