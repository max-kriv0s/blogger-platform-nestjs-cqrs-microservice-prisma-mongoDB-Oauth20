import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { CreateUserInfoDto } from '../dto';
import { UserRegistrationInfo } from '@prisma/client';

@Injectable()
export class UserRegistrationInfoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userInfo: CreateUserInfoDto): Promise<UserRegistrationInfo> {
    return this.prismaService.userRegistrationInfo.create({
      data: {
        userId: userInfo.userId,
        confirmationCode: userInfo.confirmationCode,
        expirationConfirmationCode: userInfo.expirationConfirmationCode,
      },
    });
  }

  update(
    id: string,
    data: Partial<Omit<UserRegistrationInfo, 'id'>>,
  ): Promise<UserRegistrationInfo> {
    return this.prismaService.userRegistrationInfo.update({
      where: { id },
      data: data,
    });
  }

  async findByCodeConfirmation(
    code: string,
  ): Promise<UserRegistrationInfo | null> {
    return this.prismaService.userRegistrationInfo.findFirst({
      where: { confirmationCode: code },
    });
  }

  async findByRecoveryCode(recoveryCode: string) {
    return this.prismaService.userRegistrationInfo.findFirst({
      where: { recoveryCode },
    });
  }
}
