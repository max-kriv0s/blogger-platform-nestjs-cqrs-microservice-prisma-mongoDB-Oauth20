import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePostDto } from '@gateway/src/features/post/dto/updatePost.dto';
import { CurrentUserId } from '@gateway/src/core/decorators/currentUserId.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePostCommand } from '@gateway/src/features/post/application/use-cases/updatePost.usecase';
import { AccessTokenGuard } from '@gateway/src/features/auth/guards/accessJwt.guard';
import { Result } from '../../../core';
import { PostQueryRepository } from '@gateway/src/features/post/db/post.query.repository';
import { UpdatePostSwaggerDecorator } from '@gateway/src/core/swagger/post/updatePost.swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadImageConfig } from '../config/uploadImage.config';
import { ImageInputDto } from '../../user/dto';
import { UploadImagePostCommand } from '../application/use-cases';
import { FileUploadResponse } from '@libs/contracts';
import { UploadImagePostSwaggerDecorator } from '@gateway/src/core/swagger/post/uploadImagePost.swagger.decorator';

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

  @UploadImagePostSwaggerDecorator()
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImagePost(
    @CurrentUserId() userId: string,
    @UploadedFile(uploadImageConfig()) image: Express.Multer.File,
  ): Promise<FileUploadResponse> {
    const imadeDto: ImageInputDto = {
      userId,
      originalname: image.originalname,
      buffer: image.buffer,
    };

    const downloadResult = await this.commandBus.execute<
      UploadImagePostCommand,
      Result<FileUploadResponse>
    >(new UploadImagePostCommand(imadeDto));
    if (!downloadResult.isSuccess) {
      throw downloadResult.err;
    }
    return downloadResult.value;
  }
}
