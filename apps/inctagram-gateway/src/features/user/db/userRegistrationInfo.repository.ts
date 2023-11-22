import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { CreateUserInfoDto } from '../dto';

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
