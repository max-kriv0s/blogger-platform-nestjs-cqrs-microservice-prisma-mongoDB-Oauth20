import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from '../../core/decorators/currentUserId.decorator';
import { AvatarUploadRequest, AvatarUploadResponse } from '@libs/contracts';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserCommand, UploadAvatarUserCommand } from './application';
import { Result } from '../../core';
import { AccessTokenGuard } from '../auth/guards/accessJwt.guard';
import { UpdateUserDto } from './dto';
import { UserQueryRepository } from './db';
import { ResponseUserDto } from './responses';
import { ApiTags } from '@nestjs/swagger';
import { MeSwaggerDecorator } from '../../core/swagger/user/me.swagger.decorator';
import { UpdateUserSwaggerDecorator } from '../../core/swagger/user/updateUser.swagger.decorator';

@ApiTags('User')
@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly userQueryRepo: UserQueryRepository,
  ) {}

  @MeSwaggerDecorator()
  @Get()
  async me(@CurrentUserId() userId: string): Promise<ResponseUserDto> {
    const userViewResult = await this.userQueryRepo.getUserViewById(userId);
    if (!userViewResult.isSuccess) {
      throw userViewResult.err;
    }
    return userViewResult.value;
  }

  @UpdateUserSwaggerDecorator()
  @Put()
  async updateUser(
    @CurrentUserId() userId: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const updateResult = await this.commandBus.execute<
      UpdateUserCommand,
      Result
    >(new UpdateUserCommand(userId, updateDto));

    if (!updateResult.isSuccess) {
      throw updateResult.err;
    }

    const userViewResult = await this.userQueryRepo.getUserViewById(userId);
    if (!userViewResult.isSuccess) {
      throw userViewResult.err;
    }
    return userViewResult.value;
  }

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

    // const downloadResult = await this.commandBus.execute<
    //   UploadAvatarUserCommand,
    //   Result<AvatarUploadResponse>
    // >(new UploadAvatarUserCommand(data));
    // if (!downloadResult.isSucces) {
    //   throw downloadResult.err;
    // }
  }
}
