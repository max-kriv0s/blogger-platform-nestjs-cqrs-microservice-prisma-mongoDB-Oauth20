import { Module } from '@nestjs/common';
import { PostController } from '@gateway/src/features/post/api/post.controller';

@Module({
  controllers: [PostController],
})
export class PostModule {}
