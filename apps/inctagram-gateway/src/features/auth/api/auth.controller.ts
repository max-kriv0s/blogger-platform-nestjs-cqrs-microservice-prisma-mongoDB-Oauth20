import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { CreateUserDto } from '@user/dto';
import { UserFasade } from '@user/user.fasade';

@Controller('auth')
export class AuthController {
  constructor(private readonly userFasade: UserFasade) {}

  @Post('registration')
  async createUser(@Body() userDto: CreateUserDto) {
    const resultCreated = await this.userFasade.useCases.createUser(userDto);
    const userView = await this.userFasade.queries.getUserViewById(
      resultCreated.id,
    );
    if (!userView) {
      throw new NotFoundException();
    }
    return userView;
  }
}
