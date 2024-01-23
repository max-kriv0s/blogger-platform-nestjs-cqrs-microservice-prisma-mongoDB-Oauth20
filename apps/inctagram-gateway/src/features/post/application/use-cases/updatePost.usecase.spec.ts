import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@gateway/src/core/prisma/prisma.servise';
import { AppModule } from '@gateway/src/app.module';
import { UpdatePostDto } from '@gateway/src/features/post/dto/updatePost.dto';
import {
  UpdatePostCommand,
  UpdatePostUseCase,
} from '@gateway/src/features/post/application/use-cases/updatePost.usecase';
import { randomString } from '@gateway/test/e2e.tests/utils/tests.utils';
import { Post } from '@prisma/client';

describe('UpdatePostUseCase', () => {
  let module: TestingModule;
  let prismaService: PrismaService;
  let useCase: UpdatePostUseCase;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    useCase = module.get<UpdatePostUseCase>(UpdatePostUseCase);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    await module.close();
  });

  describe('execute', () => {
    it('should update post description', async () => {
      const userDto = {
        name: randomString(10),
        email: `${randomString(6)}@test.com`,
        hashPassword: '12345',
      };

      const user = await prismaService.user.create({ data: userDto });

      const postDto = {
        description: 'new post created',
        authorId: user.id,
        createdAt: new Date(),
      };

      const post: Post = await prismaService.post.create({ data: postDto });

      const payload: UpdatePostDto = {
        description: 'post updated',
      };

      const updateResult = await useCase.execute(
        new UpdatePostCommand(post.id, payload, user.id),
      );

      expect(updateResult.isSuccess).toBe(true);

      const updatedPost = await prismaService.post.findUnique({
        where: { id: post.id },
      });

      expect(updatedPost.description).toEqual('post updated');
    });
  });
});
