import {
  AvatarDeleteRequest,
  AvatarUploadRequest,
  AvatarUploadResponse,
} from '@libs/contracts';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { DeleteAvatarCommand, UploadAvatarCommand } from './application';

@Controller('files')
export class FilesController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePattern({ cmd: 'upload_avatar' })
  async uploadAvatar(
    payload: AvatarUploadRequest,
  ): Promise<AvatarUploadResponse> {
    return this.commandBus.execute<UploadAvatarCommand, AvatarUploadResponse>(
      new UploadAvatarCommand(payload),
    );
  }

  @MessagePattern({ cmd: 'delete_avatar' })
  async deleteAvatar({ fileId }: AvatarDeleteRequest) {
    return this.commandBus.execute<DeleteAvatarCommand>(
      new DeleteAvatarCommand(fileId),
    );
  }
}
