import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.servise';
import { ResponseUserDto } from '@user/responses';

@Injectable()
export class UserQueryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserViewById(id: string): Promise<ResponseUserDto | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id, isDeleted: false },
    });
    if (!user) {
      return null;
    }
    return ResponseUserDto.getView(user);
  }
}
