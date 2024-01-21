import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gateway/src/core/prisma/prisma.servise';
import { Post } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private prismaService: PrismaService) {}
  async findById(id: string) {
    return this.prismaService.post.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<Omit<Post, 'id'>>) {
    return this.prismaService.post.update({
      where: { id },
      data,
    });
  }
}
