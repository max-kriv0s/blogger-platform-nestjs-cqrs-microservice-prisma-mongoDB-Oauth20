import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { AvatarUploadRequest, AvatarUploadResponse } from '@libs/contracts';

@Injectable()
export class S3StorageAdapter {
  logger = new Logger(S3StorageAdapter.name);

  s3Client: S3Client;
  bucketName = this.configService.getOrThrow('BUCKET_NAME');

  constructor(private readonly configService: ConfigService) {
    const REGION = '';
    this.s3Client = new S3Client({
      region: REGION,
      endpoint: configService.getOrThrow('S3_ENDPOINT_URL'),
      credentials: {
        secretAccessKey: configService.getOrThrow('S3_SECRET_ACCESS_KEY'),
        accessKeyId: configService.getOrThrow('S3_ACCESS_KEY_ID'),
      },
    });
  }

  async saveAvatar({
    userId,
    originalname,
    buffer,
  }: AvatarUploadRequest): Promise<AvatarUploadResponse> {
    const key = `content/users/${userId}/avatars/${originalname}.png`;
    const bucketParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'image/png',
    };

    const command = new PutObjectCommand(bucketParams);

    try {
      const uploadResult = await this.s3Client.send(command);

      return {
        url: key,
        fileId: uploadResult.ETag,
      };
    } catch (exception) {
      this.logger.error(exception);
      throw exception;
    }
  }

  async deleteAvatar(fileId: string) {
    const bucketParams = { Bucket: this.bucketName, Key: fileId };
    try {
      const data = await this.s3Client.send(
        new DeleteObjectCommand(bucketParams),
      );
      return data;
    } catch (exception) {
      this.logger.error(exception);
      throw exception;
    }
  }
}
