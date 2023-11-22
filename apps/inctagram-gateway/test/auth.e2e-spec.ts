import { INestApplication } from '@nestjs/common';
import { endpoints } from '../src/features/auth/api';
import { CreateUserDto } from '../src/features/user/dto';
import { ResponseUserDto } from '../src/features/user/responses';
import { AuthTestHelper } from './testHelpers/auth.test.helper';
import { getAppForE2ETesting } from './utils/tests.utils';

jest.setTimeout(15000);

describe('AuthController (e2e) test', () => {
  let app: INestApplication;
  let authTestHelper: AuthTestHelper;

  beforeAll(async () => {
    app = await getAppForE2ETesting(() => {});

    authTestHelper = new AuthTestHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration new user to the system', () => {
    it(`${endpoints.registration()} (POST) - registration the user with correct data'`, async () => {
      const userDto: CreateUserDto = {
        username: 'new-test-user',
        password: 'new-test-user',
        email: 'test@test.com',
      };

      const { body } = await authTestHelper.registrationUser(userDto);

      const expectedBody: ResponseUserDto = {
        id: expect.any(String),
        username: userDto.username,
        email: userDto.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      expect(body).toEqual(expectedBody);
      return body;
    });
  });
});
