import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { ResponseUserDto } from '../responses';
import { Result } from '../../../core/result';
import { NotFoundError } from '../../../core/exceptions';
import { USER_NOT_FOUND } from '../user.constants';

@Injectable()
export class UserQueryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserViewById(id: string): Promise<Result<ResponseUserDto>> {
    const user = await this.prismaService.user.findUnique({
      where: { id, isDeleted: false },
    });
    if (!user) {
      return Result.Err(new NotFoundError(USER_NOT_FOUND));
    }
    return Result.Ok(ResponseUserDto.getView(user));
  }
}
