import { AvatarUploadRequest, AvatarUploadResponse } from '@libs/contracts';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { S3StorageAdapter } from '../../adapters';

export class UploadAvatarCommand {
  constructor(public payload: AvatarUploadRequest) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase
  implements ICommandHandler<UploadAvatarCommand>
{
  constructor(private readonly fileStorageAdapter: S3StorageAdapter) {}

  async execute({
    payload,
  }: UploadAvatarCommand): Promise<AvatarUploadResponse> {
    return this.fileStorageAdapter.saveAvatar(payload);
  }
}
