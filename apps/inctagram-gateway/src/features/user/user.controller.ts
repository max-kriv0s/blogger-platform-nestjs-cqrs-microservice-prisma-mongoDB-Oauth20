import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from '../../core/decorators/currentUserId.decorator';
import { AvatarUploadRequest, AvatarUploadResponse } from '@libs/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { UploadAvatarUserCommand } from './application';
import { Result } from '../../core';

@UseGuards()
@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @CurrentUserId() userId: string,
    @UploadedFile() avatarFile: Express.Multer.File,
  ) {
    const data: AvatarUploadRequest = {
      userId,
      originalname: avatarFile.originalname,
      buffer: avatarFile.buffer,
    };

    const downloadResult = await this.commandBus.execute<
      UploadAvatarUserCommand,
      Result<AvatarUploadResponse>
    >(new UploadAvatarUserCommand(data));
    if (!downloadResult.isSucces) {
      throw downloadResult.err;
    }
  }
}
