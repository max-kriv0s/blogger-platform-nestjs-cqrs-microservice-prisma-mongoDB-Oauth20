import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@gateway/src/core/prisma/prisma.servise';
import { AppModule } from '@gateway/src/app.module';
import { randomString } from '@gateway/test/e2e.tests/utils/tests.utils';
import { Post, User } from '@prisma/client';
import {
  DeletePostCommand,
  DeletePostUseCase,
} from '@gateway/src/features/post/application/use-cases/deletePost.usecase';
import {
  ERROR_NOT_PERMITTED,
  ERROR_POST_NOT_FOUND,
} from '@gateway/src/features/post/post.constants';

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

      const deleteResult = await useCase.execute(
        new DeletePostCommand(post.id, 'different_user.id'),
      );

      expect(deleteResult.err.message).toBe(ERROR_NOT_PERMITTED);

      const isPostExists = await prismaService.post.findUnique({
        where: { id: post.id },
      });

      expect(isPostExists).not.toBe(null);
    });

    it('should not delete post with wrong post id', async () => {
      const deleteResult = await useCase.execute(
        new DeletePostCommand('wrong post.id', user.id),
      );

      expect(deleteResult.err.message).toBe(ERROR_POST_NOT_FOUND);

      const isPostExists = await prismaService.post.findUnique({
        where: { id: post.id },
      });

      expect(isPostExists).not.toBe(null);
    });

    it('Should delete post', async () => {
      const deleteResult = await useCase.execute(
        new DeletePostCommand(post.id, user.id),
      );

      expect(deleteResult.isSuccess).toBe(true);

      const isPostExists = await prismaService.post.findUnique({
        where: { id: post.id },
      });

      expect(isPostExists).toBe(null);
    });
  });
});
