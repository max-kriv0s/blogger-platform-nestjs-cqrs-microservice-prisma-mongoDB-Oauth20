import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostUseCase } from '@gateway/src/features/post/application/use-cases/updatePost.usecase';

export const POST_USE_CASE: Type<ICommandHandler>[] = [UpdatePostUseCase];
