import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto, UserPasswordRecoveryDto } from '../../user/dto';
import { UserFasade } from '../../user/user.fasade';
import { ConfirmationCodeDto, ConfirmationRecoveryCodeDto } from '../dto';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserDto } from '../../user/responses';
import { BadRequestResponse } from '../../../core/responses';

const baseUrl = '/auth';

export const endpoints = {
  registration: () => `${baseUrl}/registration`,
  registrationConfirmation: () => `${baseUrl}/registration-confirmation`,
};
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userFasade: UserFasade) {}

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
    const confirmationResult =
      await this.userFasade.useCases.confirmationRegistration(confirmDto);
    if (!confirmationResult.isSuccess) {
      throw confirmationResult.err;
    }
  }

  @ApiOperation({
    summary: 'User password recovery',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(passwordRRecoveryDto: UserPasswordRecoveryDto) {
    const recoveryResult = await this.userFasade.useCases.passwordRecovery(
      passwordRRecoveryDto,
    );
    if (!recoveryResult.isSuccess) {
      throw recoveryResult.err;
    }
  }

  @ApiOperation({
    summary: 'User recovery code confirmation',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @Post('password-recovery-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecoveryConfirmation(recoveryDto: ConfirmationRecoveryCodeDto) {
    const confirmationResult =
      await this.userFasade.useCases.confirmationPasswordRecovery(recoveryDto);

    if (!confirmationResult.isSuccess) {
      throw confirmationResult.err;
    }
  }
}
