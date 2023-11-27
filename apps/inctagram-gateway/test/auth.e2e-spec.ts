import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { EmailAdapter } from '../src/infrastructure';
import { AuthTestHelper } from './testHelpers/auth.test.helper';
import {
  getErrorMessagesBadRequest,
  getAppForE2ETesting,
  randomString,
  randomUUID,
  paramMock,
} from './utils/tests.utils';
import { endpoints } from '../src/features/auth/api';
import { ResponseUserDto } from '../src/features/user/responses';
import {
  ERROR_EMAIL_IS_ALREADY_REGISTRED,
  ERROR_FORMAT_EMAIL,
  ERROR_INCORRECT_RECOVER_CODE,
  ERROR_LENGTH_PASSWORD,
  ERROR_LENGTH_USERNAME,
  ERROR_PASSWORDS_MUST_MATCH,
  ERROR_PASSWORD_MUST_CONTAIN,
  ERROR_USER_WITH_THIS_EMAIL_NOT_EXIST,
} from '../src/features/user/user.constants';
import { NewPasswordDto } from '../src/features/user/dto';

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
      imports: [AppModule],
    })
      .overrideProvider(EmailAdapter)
      .useValue(emailAdapterMock)
      .compile();

    app = await getAppForE2ETesting(testingModule);

    authTestHelper = new AuthTestHelper(app);
  });

  afterEach(async () => {
    jest.resetAllMocks();
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
        email: userDto.email,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      };

      expect(body).toEqual(expectedBody);

      await new Promise((pause) => setTimeout(pause, 100));

      const mockParam = paramMock(emailAdapterMock.sendEmail.mock);
      expect(mockParam[0]).toBe(userDto.email);
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
    it(`${endpoints.registration()} (POST) - User with this email is already registered'`, async () => {
      const userDto = authTestHelper.userDto();

      await authTestHelper.registrationUser(userDto);

      userDto.username = randomString(10);
      const { body } = await authTestHelper.registrationUser(userDto, {
        expectedCode: HttpStatus.BAD_REQUEST,
      });

      errorMessagesBadRequest.message[0].field = 'email';
      errorMessagesBadRequest.message[0].message =
        ERROR_EMAIL_IS_ALREADY_REGISTRED;

      expect(body).toEqual(errorMessagesBadRequest);

      await new Promise((pause) => setTimeout(pause, 100));

      expect(emailAdapterMock.sendEmail).toHaveBeenCalled();
      const mock = emailAdapterMock.sendEmail.mock;
      const callWithCurrentEmail = mock.calls.filter((call) => {
        return call[0] === userDto.email;
      });
      expect(callWithCurrentEmail.length).toBe(1);
    });
  });

  describe('Confirmation user', () => {
    it(`${endpoints.registrationConfirmation} (POST) confirmation code correct data`, async () => {
      const userDto = authTestHelper.userDto();

      await authTestHelper.registrationUser(userDto);
      await new Promise((pause) => setTimeout(pause, 100));

      expect(emailAdapterMock.sendEmail).toHaveBeenCalled();
      const mockParam = paramMock(emailAdapterMock.sendEmail.mock);
      expect(mockParam[0]).toBe(userDto.email);

      const message = mockParam[2];
      const startIndex = message.indexOf('code');
      expect(startIndex).not.toBe(-1);

      const codeConfirmation = message.slice(
        startIndex + 5,
        message.indexOf("'", startIndex) !== -1
          ? message.indexOf("'", startIndex)
          : message.length,
      );

      await authTestHelper.confirmRegistration({ code: codeConfirmation });
    });
    it(`${endpoints.registrationConfirmation} (POST) confirmation code incorrect data`, async () => {
      await authTestHelper.confirmRegistration(
        { code: '' },
        { expectedCode: HttpStatus.BAD_REQUEST },
      );
    });
  });

  describe('Unauthorized user did not receive link to email', () => {
    it(`${endpoints.registration()} (POST) - resend verification code`, async () => {
      const userDto = authTestHelper.userDto();

      await authTestHelper.registrationUser(userDto);
      await authTestHelper.registrationUser(userDto);

      await new Promise((pause) => setTimeout(pause, 100));

      expect(emailAdapterMock.sendEmail).toHaveBeenCalled();
      expect(emailAdapterMock.sendEmail.mock.lastCall[0]).toBe(userDto.email);

      const mock = emailAdapterMock.sendEmail.mock;
      const callWithCurrentEmail = mock.calls.filter((call) => {
        return call[0] === userDto.email;
      });
      expect(callWithCurrentEmail.length).toBe(2);
    });
  });

  describe('Password recovery', () => {
    it(`${endpoints.passwordRecovery} (POST) Password recovery correct data`, async () => {
      const userDto = authTestHelper.userDto();

      await authTestHelper.registrationUser(userDto);
      await new Promise((pause) => setTimeout(pause, 100));

      expect(emailAdapterMock.sendEmail).toHaveBeenCalled();
      let mockParam = paramMock(emailAdapterMock.sendEmail.mock);
      expect(mockParam[0]).toBe(userDto.email);

      const message = mockParam[2];
      let startIndex = message.indexOf('code');
      expect(startIndex).not.toBe(-1);

      const codeConfirmation = message.slice(
        startIndex + 5,
        message.indexOf("'", startIndex) !== -1
          ? message.indexOf("'", startIndex)
          : message.length,
      );

      await authTestHelper.confirmRegistration({ code: codeConfirmation });

      await authTestHelper.passwordRecovery({ email: userDto.email });
      await new Promise((pause) => setTimeout(pause, 100));

      mockParam = paramMock(emailAdapterMock.sendEmail.mock);
      expect(mockParam[0]).toBe(userDto.email);
      const messageRecoveryCode = mockParam[2];

      startIndex = messageRecoveryCode.indexOf('recoveryCode');
      expect(startIndex).not.toBe(-1);
    });

    it(`${endpoints.passwordRecovery} (POST) Password recovery incorrect data`, async () => {
      const userDto = authTestHelper.userDto();
      await authTestHelper.registrationUser(userDto);

      const email = '1' + userDto.email;
      const { body } = await authTestHelper.passwordRecovery(
        { email },
        { expectedCode: HttpStatus.BAD_REQUEST },
      );

      errorMessagesBadRequest.message[0].field = 'email';
      errorMessagesBadRequest.message[0].message =
        ERROR_USER_WITH_THIS_EMAIL_NOT_EXIST;

      expect(body).toEqual(errorMessagesBadRequest);
    });

    it(`${endpoints.passwordRecovery} (POST) Unauthorized user I didn't receive the link by email`, async () => {
      const userDto = authTestHelper.userDto();

      await authTestHelper.registrationUser(userDto);
      await new Promise((pause) => setTimeout(pause, 100));
      await authTestHelper.passwordRecovery({ email: userDto.email });
      await new Promise((pause) => setTimeout(pause, 100));

      const mockParam = paramMock(emailAdapterMock.sendEmail.mock);
      expect(mockParam[0]).toBe(userDto.email);
      const message = mockParam[2];

      const startIndex = message.indexOf('code');
      expect(startIndex).not.toBe(-1);
    });
  });

  describe('New password', () => {
    it(`${endpoints.newPassword} (POST) New password correct data`, async () => {
      const userDto = authTestHelper.userDto();

      await authTestHelper.registrationUser(userDto);
      await new Promise((pause) => setTimeout(pause, 100));

      let mockParam = paramMock(emailAdapterMock.sendEmail.mock);
      const message = mockParam[2];
      let startIndex = message.indexOf('code');

      const codeConfirmation = message.slice(
        startIndex + 5,
        message.indexOf("'", startIndex) !== -1
          ? message.indexOf("'", startIndex)
          : message.length,
      );

      await authTestHelper.confirmRegistration({ code: codeConfirmation });

      await authTestHelper.passwordRecovery({ email: userDto.email });
      await new Promise((pause) => setTimeout(pause, 100));

      mockParam = paramMock(emailAdapterMock.sendEmail.mock);
      expect(mockParam[0]).toBe(userDto.email);
      const messageRecoveryCode = mockParam[2];

      startIndex = messageRecoveryCode.indexOf('recoveryCode');
      const recoveryCode = messageRecoveryCode.slice(
        startIndex + 13,
        messageRecoveryCode.indexOf("'", startIndex) !== -1
          ? messageRecoveryCode.indexOf("'", startIndex)
          : messageRecoveryCode.length,
      );

      const newPassword = `${randomString(10)}TU1!`;
      const data: NewPasswordDto = {
        recoveryCode,
        password: newPassword,
        passwordConfirmation: newPassword,
      };
      await authTestHelper.newPassword(data);
    });

    it(`${endpoints.newPassword} (POST) New password incorrect data`, async () => {
      const newPassword = `${randomString(10)}TU1!`;
      const data: NewPasswordDto = {
        recoveryCode: randomUUID(),
        password: newPassword,
        passwordConfirmation: newPassword,
      };
      const { body } = await authTestHelper.newPassword(data, {
        expectedCode: HttpStatus.BAD_REQUEST,
      });

      errorMessagesBadRequest.message[0].field = 'recoveryCode';
      errorMessagesBadRequest.message[0].message = ERROR_INCORRECT_RECOVER_CODE;

      expect(body).toEqual(errorMessagesBadRequest);
    });
  });
});
