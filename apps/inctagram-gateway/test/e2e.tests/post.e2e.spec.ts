// import { INestApplication } from '@nestjs/common';
// import { Test } from '@nestjs/testing';
// import { AppModule } from '@gateway/src/app.module';
// import { EmailManagerModule } from '@gateway/src/core/email-manager/email-manager.module';
// import { EmailAdapter } from '@gateway/src/infrastructure';
// import { AuthTestHelper } from '@gateway/test/e2e.tests/testHelpers/auth.test.helper';
// import {
//   findUUIDv4,
//   getAppForE2ETesting,
//   getErrorMessagesBadRequest,
//   randomString,
// } from '@gateway/test/e2e.tests/utils/tests.utils';
//
// import { LoginDto } from '@gateway/src/features/auth/dto/login.dto';
// import { endpoints } from '@gateway/src/features/post/api/post.controller';
//
// jest.setTimeout(15000);
//
// const errorMessagesBadRequest = getErrorMessagesBadRequest();
//
// describe('PostController (e2e) test', () => {
//   let app: INestApplication;
//   let authTestHelper: AuthTestHelper;
//
//   const emailAdapterMock = {
//     sendEmail: jest.fn(),
//   };
//
//   beforeAll(async () => {
//     const testingModule = await Test.createTestingModule({
//       imports: [EmailManagerModule, AppModule],
//     })
//       .overrideProvider(EmailAdapter)
//       .useValue(emailAdapterMock)
//       .compile();
//
//     app = await getAppForE2ETesting(testingModule);
//
//     authTestHelper = new AuthTestHelper(app);
//   });
//
//   beforeEach(async () => {});
//
//   afterEach(async () => {
//     jest.restoreAllMocks();
//     jest.resetAllMocks();
//   });
//
//   afterAll(async () => {
//     await app.close();
//   });
//
//   describe('Deleting post with images', () => {
//     let refreshToken;
//     //let newrefreshToken;
//     let deviceName;
//     let accessToken;
//
//     it(`(POST) Creating new user and login`, async () => {
//       const userDto = authTestHelper.userDto();
//
//       await authTestHelper.registrationUser(userDto);
//       await new Promise((pause) => setTimeout(pause, 100));
//
//       const mock = emailAdapterMock.sendEmail.mock;
//       const lastMockCall = mock.calls.length - 1;
//
//       const message = mock.calls[lastMockCall][2];
//       const codeConfirmation = findUUIDv4(message);
//
//       await authTestHelper.confirmRegistration({ code: codeConfirmation });
//
//       const loginData = new LoginDto(userDto.email, userDto.password);
//
//       deviceName = 'chrome';
//
//       const tokenPairs = await authTestHelper.login(loginData, deviceName);
//
//       refreshToken = tokenPairs.headers['set-cookie'][0];
//
//       accessToken = tokenPairs.body.accessToken;
//     });
//
//     it(`${endpoints.deletePost()} (POST) Should delete post with images`, async () => {});
//   });
// });
