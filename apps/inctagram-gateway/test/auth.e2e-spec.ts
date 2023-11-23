import { HttpStatus, INestApplication } from '@nestjs/common';
import { endpoints } from '../src/features/auth/api';
import { ResponseUserDto } from '../src/features/user/responses';
import { AuthTestHelper } from './testHelpers/auth.test.helper';
import {
  getAppForE2ETesting,
  getErrorMessagesBadRequest,
  randomString,
} from './utils/tests.utils';
import { Test } from '@nestjs/testing';
import { EmailManagerModule } from '../src/core/email-manager/email-manager.module';
import { AppModule } from '../src/app.module';
import { EmailAdapter } from '../src/infrastructure';
import {
  ERROR_FORMAT_EMAIL,
  ERROR_LENGTH_PASSWORD,
  ERROR_LENGTH_USERNAME,
  ERROR_PASSWORDS_MUST_MATCH,
  ERROR_PASSWORD_MUST_CONTAIN,
} from '../src/features/user/user.constants';

jest.setTimeout(15000);

const errorMessagesBadRequest = getErrorMessagesBadRequest();

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
      const userDto = authTestHelper.userDto();

      const { body } = await authTestHelper.registrationUser(userDto);
      const expectedBody: ResponseUserDto = {
        id: expect.any(String),
        username: userDto.username,
        email: userDto.email,ERROR_LENGTH_USERNAME
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      expect(body).toEqual(expectedBody);

      await new Promise((pause) => setTimeout(pause, 100));

      expect(emailAdapterMock.sendEmail).toHaveBeenCalled();
      expect(emailAdapterMock.sendEmail).toBeCalledTimes(1);
      expect(emailAdapterMock.sendEmail.mock.calls[0][0]).toBe(userDto.email);
    });
    it(`${endpoints.registration()} (POST) - registration the user incorrect username'`, async () => {
      const userDto = authTestHelper.userDto();
      userDto.username = '';

      errorMessagesBadRequest.message[0].field = 'username';
      errorMessagesBadRequest.message[0].message = ERROR_LENGTH_USERNAME;

      let body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);

      userDto.username = 'test';
      body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);

      userDto.username = randomString(31);
      body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);
    });

    it(`${endpoints.registration()} (POST) - registration the user incorrect email'`, async () => {
      const userDto = authTestHelper.userDto();
      userDto.email = 'test';

      errorMessagesBadRequest.message[0].field = 'email';
      errorMessagesBadRequest.message[0].message = ERROR_FORMAT_EMAIL;

      const body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);
    });

    it(`${endpoints.registration()} (POST) - registration the user incorrect password'`, async () => {
      const userDto = authTestHelper.userDto();

      errorMessagesBadRequest.message[0].field = 'password';
      errorMessagesBadRequest.message[0].message = ERROR_LENGTH_PASSWORD;

      userDto.password = 'tE1!';
      userDto.passwordConfirm = userDto.password;

      let body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);

      userDto.password = randomString(21) + 'A!0';
      userDto.passwordConfirm = userDto.password;
      body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);

      userDto.password = '';
      userDto.passwordConfirm = userDto.password;

      errorMessagesBadRequest.message[0].field = 'password';
      errorMessagesBadRequest.message[0].message = ERROR_PASSWORD_MUST_CONTAIN;

      body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);
    });

    it(`${endpoints.registration()} (POST) - registration the user incorrect passwordConfirm'`, async () => {
      const userDto = authTestHelper.userDto();
      userDto.passwordConfirm = '';

      errorMessagesBadRequest.message[0].field = 'passwordConfirm';
      errorMessagesBadRequest.message[0].message = ERROR_PASSWORDS_MUST_MATCH;

      const body = (
        await authTestHelper.registrationUser(userDto, {
          expectedCode: HttpStatus.BAD_REQUEST,
        })
      ).body;
      expect(body).toEqual(errorMessagesBadRequest);
    });
  });
});
