import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@gateway/src/core/prisma/prisma.servise';
import { AppModule } from '@gateway/src/app.module';
import { PostRepository } from '@gateway/src/features/post/db/post.repository';

describe('UpdatePostUseCase', () => {
  let module: TestingModule;
  //let postRepository: PostRepository;
  let prismaService: PrismaService;
  //let postModel: Model<File>;
  //let useCase: UpdatePostUseCase;

  // const mockFileModel = {
  //   save: jest.fn(),
  // };
  //
  // const mockPostRepo = {
  //   updatePost: jest.fn(),
  // };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
      // providers: [
      //   UpdatePostUseCase,
      //   { provide: PostRepository, useValue: mockPostRepo },
      // ],
    }).compile();

    postRepository = module.get<PostRepository>(PostRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    // useCase = module.get<UpdatePostUseCase>(UpdatePostUseCase);
    // fileModel = module.get<Model<Post>>(getModelToken(File.name));
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    await module.close();
  });

  describe('execute', () => {
    it('should update post description', async () => {
      console.log('test');
      const postDto = {
        description: 'new post created',
        authorId: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: new Date(),
        //imageId: '550e8400-e29b-41d4-a716-446655440000',
      };

      const post = await prismaService.post.create({ data: postDto });

      console.log(post);
    });
  });
});
