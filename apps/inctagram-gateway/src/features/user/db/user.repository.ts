import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.servise';
import { CreateUserDto } from '../dto';


@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create(userDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        name: userDto.username,
        email: userDto.email,
        hashPassword: userDto.password,
      },
    });
  }
}
