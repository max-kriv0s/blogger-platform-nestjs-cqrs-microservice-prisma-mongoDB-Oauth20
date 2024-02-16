// import { HttpStatus, INestApplication } from '@nestjs/common';
// import request from 'supertest';
// import { endpoints } from '../../../src/features/auth/api';
// import {
//   CreateUserDto,
//   NewPasswordDto,
//   UserPasswordRecoveryDto,
// } from '../../../src/features/user/dto';
// import { ConfirmationCodeDto } from '../../../src/features/auth/dto';
// import { getGlobalPrefix, randomString } from '../utils/tests.utils';
// import { LoginDto } from '@gateway/src/features/auth/dto/login.dto';
// import { CreatePostDto } from '@gateway/src/features/post/dto/createPost.dto';
//
// export class PostTestHelper {
//   globalPrefix = getGlobalPrefix();
//   constructor(private app: INestApplication) {}
//
//   postDto(): CreatePostDto {
//     return {
//       description: randomString(20),
//       images: [randomString(20)],
//     };
//   }
//
//   async newRefreshToken(
//     refreshToken,
//     deviceName,
//     config: {
//       expectedCode?: number;
//     } = {},
//   ) {
//     const expectedCode = config.expectedCode ?? HttpStatus.NO_CONTENT;
//
//     return request(this.app.getHttpServer())
//       .post(this.globalPrefix + endpoints.newRefreshToken())
//       .send()
//       .set('Cookie', `${refreshToken}`)
//       .set('user-agent', deviceName)
//       .expect(expectedCode);
//   }
// }
