import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserFasade } from '../../user/user.fasade';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy) {
  constructor(private userFacade: UserFasade) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<{ id: string } | any> {
    // validate input loginOrEmail and password
    //await validateLoginOrEmail(loginOrEmail, password);
    //if input values are correct, check credentials
    // const userInfo = await this.userFacade.useCases.
    // if user isn`t found in db, should take error
    // if (!userInfo) throw new UnauthorizedException();
    //return userInfo;
  }
}
