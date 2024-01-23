import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostUseCase } from '@gateway/src/features/post/application/use-cases/updatePost.usecase';
import { UploadImagePostUseCase } from './uploadImagePost.usecase';

export * from './uploadImagePost.usecase';

export const POST_USE_CASE: Type<ICommandHandler>[] = [
  UpdatePostUseCase,
  UploadImagePostUseCase,
];
