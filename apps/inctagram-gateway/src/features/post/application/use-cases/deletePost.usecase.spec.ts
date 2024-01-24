import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@gateway/src/core/prisma/prisma.servise';
import { AppModule } from '@gateway/src/app.module';
import { UpdatePostDto } from '@gateway/src/features/post/dto/updatePost.dto';
import { UpdatePostCommand } from '@gateway/src/features/post/application/use-cases/updatePost.usecase';
import { randomString } from '@gateway/test/e2e.tests/utils/tests.utils';
import { Post, User } from '@prisma/client';
import {
  DeletePostCommand,
  DeletePostUseCase,
} from '@gateway/src/features/post/application/use-cases/deletePost.usecase';

describe('DeletePostUseCase', () => {
  let module: TestingModule;
  let prismaService: PrismaService;
  let useCase: DeletePostUseCase;
  let post: Post;
  let user: User;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    useCase = module.get<DeletePostUseCase>(DeletePostUseCase);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    await module.close();
  });

  describe('execute', () => {
    it('should not delete post when post does not belong to user', async () => {
      const userDto = {
        name: randomString(10),
        email: `${randomString(6)}@test.com`,
        hashPassword: '12345',
      };

      user = await prismaService.user.create({ data: userDto });

      const postDto = {
        description: 'new post created',
        authorId: user.id,
        createdAt: new Date(),
      };

      post = await prismaService.post.create({ data: postDto });

      const payload: UpdatePostDto = {
        description: 'post updated',
      };

      const updateResult = await useCase.execute(
        new UpdatePostCommand(post.id, payload, user.id),
      );

      expect(updateResult.isSuccess).toBe(true);

      const deleteResult = await useCase.execute(
        new DeletePostCommand(post.id, user.id),
      );

      const updatedPost = await prismaService.post.findUnique({
        where: { id: post.id },
      });

      expect(updatedPost).toBe(null);

      //expect(deleteResult.err.message).toBe(ERROR_NOT_PERMITTED);

      // await prismaService.post.delete({
      //   where: { id: post.id },
      // });
      //
      // const updatedPost = await prismaService.post.findUnique({
      //   where: { id: post.id },
      // });
      //
      // expect(updatedPost).toBe(null);
    });

    // it('should not delete post with wrong post id', async () => {
    //
    //
    // });
  });
});
