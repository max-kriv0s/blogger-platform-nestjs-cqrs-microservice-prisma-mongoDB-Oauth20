import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { ResponseUserDto } from '../responses';

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
