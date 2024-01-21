import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { UploadFileUseCase } from './uploadFile.usecase';
import { DeleteFileUseCases } from './deleteFile.usecase';

export * from './uploadFile.usecase';
export * from './deleteFile.usecase';

export const FILES_USE_CASES: Type<ICommandHandler>[] = [
  UploadFileUseCase,
  DeleteFileUseCases,
];
