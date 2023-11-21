import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.servise';
import { UserEntity } from '@user/entities';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(user: UserEntity) {
    return this.prismaService.user.create({
      data: {
        name: user.name,
        email: user.email,
        hashPassword: user.hashPassword,
      },
    });
  }
}
