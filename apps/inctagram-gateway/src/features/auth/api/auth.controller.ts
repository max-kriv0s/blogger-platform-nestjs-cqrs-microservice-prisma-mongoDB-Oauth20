import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto';
import { UserFasade } from '../../user/user.fasade';
import { ConfirmationCodeDto } from '../dto';

const baseUrl = '/auth';

export const endpoints = {
  registration: () => `${baseUrl}/registration`,
  registrationConfirmation: () => `${baseUrl}/registration-confirmation`,
};

@Controller('auth')
export class AuthController {
  constructor(private readonly userFasade: UserFasade) {}

  @Post('registration')
  async createUser(@Body() userDto: CreateUserDto) {
    const resultCreated = await this.userFasade.useCases.createUser(userDto);

    if (!resultCreated.isSuccess) {
      return resultCreated.err;
    }

    const resultView = await this.userFasade.queries.getUserViewById(
      resultCreated.value.id,
    );
    if (!resultView.isSuccess) {
      return resultCreated.err;
    }
    return resultView.value;
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmRegistration(@Body() confirmDto: ConfirmationCodeDto) {
    const resultConfirmed =
      await this.userFasade.useCases.confirmationRegistration(confirmDto);
    if (!resultConfirmed.isSuccess) {
      return resultConfirmed.err;
    }
  }
}
