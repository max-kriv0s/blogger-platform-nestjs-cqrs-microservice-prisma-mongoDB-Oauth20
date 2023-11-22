import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.servise';
import { CreateUserInfoDto } from '@user/dto';

@Injectable()
export class UserRegistrationInfoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userInfo: CreateUserInfoDto) {
    return this.prismaService.userRegistrationInfo.create({
      data: {
        userId: userInfo.userId,
        confirmationCode: userInfo.confirmationCode,
        expirationConfirmationCode: userInfo.expirationConfirmationCode,
      },
    });
  }
}
