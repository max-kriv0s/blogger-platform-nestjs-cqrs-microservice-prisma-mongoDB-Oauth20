import { AvatarUploadRequest, AvatarUploadResponse } from '@libs/contracts';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { S3StorageAdapter } from '../../adapters';
import { FileRepository } from '../../db/file.repository';
import { FileEntity } from '../../entities/file.entity';
import { IFile } from '../../interface/file.interface';

export class UploadAvatarCommand {
  constructor(public payload: AvatarUploadRequest) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase
  implements ICommandHandler<UploadAvatarCommand>
{
  constructor(
    private readonly fileStorageAdapter: S3StorageAdapter,
    private readonly fileRepo: FileRepository,
  ) {}

  async execute({
    payload,
  }: UploadAvatarCommand): Promise<AvatarUploadResponse> {
    const downloadFile = await this.fileStorageAdapter.saveAvatar(payload);

    // TODO добавить проверку валидации полей payload

    const fileDto: IFile = {
      userId: payload.userId,
      fileType: payload.fileType,
      originalname: payload.originalname,
      format: payload.format,
      url: downloadFile.url,
      fileId: downloadFile.fileId,
    };

    const fileEntity = new FileEntity(fileDto);
    const file = await this.fileRepo.createFile(fileEntity);

    return { fileId: file._id };
  }
}
