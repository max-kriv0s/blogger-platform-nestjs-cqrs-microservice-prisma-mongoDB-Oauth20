import { Module } from '@nestjs/common';
import { PostController } from '@gateway/src/features/post/api/post.controller';
import { PostRepository } from '@gateway/src/features/post/db/post.repository';
import { POST_USE_CASE } from '@gateway/src/features/post/application/use-cases';
import { CqrsModule } from '@nestjs/cqrs';
import { PostQueryRepository } from '@gateway/src/features/post/db/post.query.repository';

@Module({
  imports: [CqrsModule],
  controllers: [PostController],
  providers: [PostRepository, ...POST_USE_CASE, PostQueryRepository],
})
export class PostModule {}
