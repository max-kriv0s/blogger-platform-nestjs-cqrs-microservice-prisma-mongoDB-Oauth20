import { User } from '@prisma/client';

export class ResponseUserDto {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;

  static getView(user: User): ResponseUserDto {
    return {
      id: user.id,
      username: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
