import { AvatarUploadRequest, AvatarUploadResponse } from '@libs/contracts';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';
import { Result } from 'apps/inctagram-gateway/src/core';
import { UserRepository } from '../../db';

export class UploadAvatarUserCommand {
  constructor(public payload: AvatarUploadRequest) {}
}

@CommandHandler(UploadAvatarUserCommand)
export class UploadAvatarUserUseCase
  implements ICommandHandler<UploadAvatarUserCommand>
{
  constructor(
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    payload,
  }: UploadAvatarUserCommand): Promise<Result<AvatarUploadResponse>> {
    const downloadResult = this.fileServiceClient.send(
      { cmd: 'upload_avatar' },
      payload,
    );
  }
}
