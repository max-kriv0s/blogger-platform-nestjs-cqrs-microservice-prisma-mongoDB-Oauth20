import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostFacade } from '@gateway/src/features/post/post.facade';
import { UpdatePostDto } from '@gateway/src/features/post/dto/updatePost.dto';
import { CurrentUserId } from '@gateway/src/core/decorators/currentUserId.decorator';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private postFacade: PostFacade) {}

  @ApiOperation({
    summary: 'Editing Post',
  })
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUserId() userId: string,
  ) {
    const isUpdated = await this.postFacade.useCases.updatePost(
      postId,
      updatePostDto,
      userId,
    );

    if (!isUpdated.isSuccess) throw isUpdated.err;
  }
}
