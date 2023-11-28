import { Response } from 'express';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../../user/dto';
import { UserFasade } from '../../user/user.fasade';
import { ConfirmationCodeDto } from '../dto';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserDto } from '../../user/responses';
import { BadRequestResponse } from '../../../core/responses';
import { DeviceFacade } from '../../device/device.facade';
import { PasswordAuthGuard } from '../guards/password.guard';
import { CurrentUserId } from '../../../core/decorators/currentUserId.decorator';
import { UserIdType } from '../../user/types/userId.type';
import { DeviceDto } from '../../device/dto/device.dto';
import { ResponseAccessTokenDto } from '../../device/responses/responseAccessToken.dto';

const baseUrl = '/auth';

export const endpoints = {
  registration: () => `${baseUrl}/registration`,
  registrationConfirmation: () => `${baseUrl}/registration-confirmation`,
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userFasade: UserFasade,
    private readonly deviceFacade: DeviceFacade,
  ) {}

  @ApiOperation({
    summary: 'User registration',
  })
  @ApiOkResponse({ type: ResponseUserDto })
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @Post('registration')
  async createUser(@Body() userDto: CreateUserDto): Promise<ResponseUserDto> {
    const resultCreated = await this.userFasade.useCases.createUser(userDto);

    if (!resultCreated.isSuccess) {
      throw resultCreated.err;
    }

    const resultView = await this.userFasade.queries.getUserViewById(
      resultCreated.value.id,
    );
    if (!resultView.isSuccess) {
      throw resultCreated.err;
    }
    return resultView.value;
  }

  @ApiOperation({
    summary: 'User registration confirmation',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() confirmDto: ConfirmationCodeDto) {
    const resultConfirmed =
      await this.userFasade.useCases.confirmationRegistration(confirmDto);
    if (!resultConfirmed.isSuccess) {
      throw resultConfirmed.err;
    }
  }

  @Post('login')
  @UseGuards(PasswordAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Ip() ip: string,
    @Headers('user-agent') title: string,
    @Res({ passthrough: true }) response: Response,
    @CurrentUserId() userIdDto: UserIdType,
  ): Promise<ResponseAccessTokenDto> {
    const result = await this.deviceFacade.useCases.createDevice(
      new DeviceDto(ip, title, userIdDto.userId),
    );
    const { accessToken, refreshToken } = result.value;

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return new ResponseAccessTokenDto(accessToken);
  }
}
