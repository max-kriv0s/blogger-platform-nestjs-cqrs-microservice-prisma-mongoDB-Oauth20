import { User, UserRegistrationInfo } from '@prisma/client';

type UserByEmailOrUsername = Pick<User, 'email' | 'name' | 'hashPassword'>;

type UserInfoIsConfirmed = Pick<UserRegistrationInfo, 'id' | 'isConfirmed'>;

export type FoundUserByEmailOrUsername = UserByEmailOrUsername & {
  userRegistrationInfo: UserInfoIsConfirmed;
};
