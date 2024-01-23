import { FileUploadRequest, FileUploadResponse } from '@libs/contracts';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Result } from '../../result';
import { firstValueFrom, timeout } from 'rxjs';
import { BadGatewayError } from '../../exceptions';
import { ERROR_UPLOAD_FILE } from './fileService.constants';

@Injectable()
export class FileServiceAdapter {
  logger = new Logger(FileServiceAdapter.name);

  constructor(
    @Inject('FILE_SERVICE') private readonly fileServiceClient: ClientProxy,
  ) {}

  async send(payload: FileUploadRequest): Promise<Result<FileUploadResponse>> {
    try {
      const responseOfService = this.fileServiceClient
        .send({ cmd: 'upload_file' }, payload)
        .pipe(timeout(10000));

      const resultResponse: FileUploadResponse = await firstValueFrom(
        responseOfService,
      );
      return Result.Ok(resultResponse);
    } catch (error) {
      this.logger.error(error);
      return Result.Err(new BadGatewayError(ERROR_UPLOAD_FILE));
    }
  }
}
