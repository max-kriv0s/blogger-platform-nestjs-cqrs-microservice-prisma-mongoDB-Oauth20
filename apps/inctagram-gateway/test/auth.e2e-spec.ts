import { INestApplication } from '@nestjs/common';
import { endpoints } from '../src/features/auth/api';
import { CreateUserDto } from '../src/features/user/dto';
import { ResponseUserDto } from '../src/features/user/responses';
import { AuthTestHelper } from './testHelpers/auth.test.helper';
import { getAppForE2ETesting } from './utils/tests.utils';
import { Test } from '@nestjs/testing';
import { EmailManagerModule } from '../src/core/email-manager/email-manager.module';
import { AppModule } from '../src/app.module';
import { EmailAdapter } from '../src/infrastructure';

jest.setTimeout(15000);

describe('AuthController (e2e) test', () => {
  let app: INestApplication;
  let authTestHelper: AuthTestHelper;

  const emailAdapterMock = {
    sendEmail: jest.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [EmailManagerModule, AppModule],
    })
      .overrideProvider(EmailAdapter)
      .useValue(emailAdapterMock)
      .compile();

    app = await getAppForE2ETesting(testingModule);

    authTestHelper = new AuthTestHelper(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Registration new user to the system', () => {
    it(`${endpoints.registration()} (POST) - registration the user with correct data'`, async () => {
      const userDto: CreateUserDto = {
        username: 'new-test-user',
        email: 'test@test.com',
        password: 'new-test-user',
        passwordConfirm: 'new-test-user',
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

      await new Promise((pause) => setTimeout(pause, 100));

      expect(emailAdapterMock.sendEmail).toHaveBeenCalled();
      expect(emailAdapterMock.sendEmail).toBeCalledTimes(1);
      expect(emailAdapterMock.sendEmail.mock.calls[0][0]).toBe(userDto.email);
    });
  });
});
