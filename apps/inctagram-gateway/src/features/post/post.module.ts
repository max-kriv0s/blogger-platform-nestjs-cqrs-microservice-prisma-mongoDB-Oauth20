import { Module } from '@nestjs/common';
import { PostController } from '@gateway/src/features/post/api/post.controller';
import { PostRepository } from '@gateway/src/features/post/db/post.repository';
import { POST_USE_CASE } from '@gateway/src/features/post/application/use-cases';
import { PostFacade } from '@gateway/src/features/post/post.facade';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from '@gateway/src/features/user/db';

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [PostRepository, ...POST_USE_CASE, PostFacade, UserRepository],
})
export class PostModule {}
