import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../user/dto';
import { UserFasade } from '../../user/user.fasade';

const baseUrl = '/auth';

export const endpoints = {
  registration: () => `${baseUrl}/registration`,
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
}
