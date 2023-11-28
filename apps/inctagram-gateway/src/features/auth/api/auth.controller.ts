import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  CreateUserDto,
  NewPasswordDto,
  UserPasswordRecoveryDto,
} from '../../user/dto';
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

const baseUrl = '/auth';

export const endpoints = {
  registration: () => `${baseUrl}/registration`,
  registrationConfirmation: () => `${baseUrl}/registration-confirmation`,
  passwordRecovery: () => `${baseUrl}/password-recovery`,
  newPassword: () => `${baseUrl}/new-password`,
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
  async passwordRecovery(
    @Body() passwordRRecoveryDto: UserPasswordRecoveryDto,
  ) {
    const recoveryResult = await this.userFasade.useCases.passwordRecovery(
      passwordRRecoveryDto,
    );
    if (!recoveryResult.isSuccess) {
      throw recoveryResult.err;
    }
  }

  @ApiOperation({
    summary: 'Changing the user password',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: BadRequestResponse })
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() dto: NewPasswordDto) {
    const updateResult = await this.userFasade.useCases.newPassword(dto);
    if (!updateResult.isSuccess) {
      throw updateResult.err;
    }
  }
}
