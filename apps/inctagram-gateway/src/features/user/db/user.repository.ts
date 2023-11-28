import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { CreateUserDto } from '../dto';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userDto: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: userDto.username,
        email: userDto.email,
        hashPassword: userDto.password,
      },
    });
  }

  async update(id: string, data: Partial<Omit<User, 'id'>>) {
    return this.prismaService.user.update({ where: { id }, data });
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ name: usernameOrEmail }, { email: usernameOrEmail }],
      },
      select: {
        id: true,
        name: true,
        hashPassword: true,
        email: true,
        userRegistrationInfo: { select: { isConfirmed: true, id: true } },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        userRegistrationInfo: { select: { isConfirmed: true } },
      },
    });
  }
}
