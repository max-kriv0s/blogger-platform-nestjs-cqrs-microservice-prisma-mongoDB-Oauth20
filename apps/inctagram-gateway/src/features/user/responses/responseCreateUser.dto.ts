import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class ResponseUserDto {
  @ApiProperty({
    description: 'user ID',
    type: 'string',
    example: uuidv4(),
  })
  id: string;

  @ApiProperty({ description: 'Username', type: 'string' })
  username: string;

  @ApiProperty({ description: 'email', type: 'string' })
  email: string;

  @ApiProperty({
    description: 'creation date',
    type: 'string',
    example: new Date().toISOString(),
  })
  createdAt: string;

  @ApiProperty({
    description: 'update date',
    type: 'string',
    example: new Date().toISOString(),
  })
  updatedAt: string;

  static getView(user: User): ResponseUserDto {
    return {
      id: user.id,
      username: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
