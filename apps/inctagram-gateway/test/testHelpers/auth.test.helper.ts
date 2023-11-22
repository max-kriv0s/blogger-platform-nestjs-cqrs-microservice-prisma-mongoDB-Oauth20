import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { endpoints } from '../../src/features/auth/api';
import { CreateUserDto } from '../../src/features/user/dto';

export class AuthTestHelper {
  constructor(private app: INestApplication) {}

  async registrationUser(
    userDto: CreateUserDto,
    config: {
      expectedCode?: number;
    } = {},
  ) {
    const expectedCode = config.expectedCode ?? HttpStatus.CREATED;

    return request(this.app.getHttpServer())
      .post('/api' + endpoints.registration())
      .send(userDto)
      .expect(expectedCode);
  }
}
