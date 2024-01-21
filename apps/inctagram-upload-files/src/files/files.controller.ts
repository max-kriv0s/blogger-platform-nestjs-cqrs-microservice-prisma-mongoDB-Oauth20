import {
  FileDeleteRequest,
  FileDeleteResponse,
  FileUploadRequest,
  FileUploadResponse,
  FileUrlRequest,
  FileUrlResponse,
} from '@libs/contracts';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { MessagePattern } from '@nestjs/microservices';
import { DeleteFileCommand, UploadFileCommand } from './application';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly filesService: FilesService,
  ) {}

  @MessagePattern({ cmd: 'upload_file' })
  async uploadFile(payload: FileUploadRequest): Promise<FileUploadResponse> {
    return this.commandBus.execute<UploadFileCommand, FileUploadResponse>(
      new UploadFileCommand(payload),
    );
  }

  @MessagePattern({ cmd: 'delete_file' })
  async deleteFile({ fileId }: FileDeleteRequest): Promise<FileDeleteResponse> {
    return this.commandBus.execute<DeleteFileCommand, FileDeleteResponse>(
      new DeleteFileCommand(fileId),
    );
  }

  @MessagePattern({ cmd: 'get_file_url' })
  async getFileInfo({ fileId }: FileUrlRequest): Promise<FileUrlResponse> {
    return this.filesService.getFileUrl(fileId);
  }
}
