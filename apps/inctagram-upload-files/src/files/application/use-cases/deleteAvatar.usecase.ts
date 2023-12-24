import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { S3StorageAdapter } from '../../adapters';

export class DeleteAvatarCommand {
  constructor(public fileId: string) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarUseCase
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(private readonly fileStorageAdapter: S3StorageAdapter) {}

  async execute({ fileId }: DeleteAvatarCommand) {
    return this.fileStorageAdapter.deleteAvatar(fileId);
  }
}
