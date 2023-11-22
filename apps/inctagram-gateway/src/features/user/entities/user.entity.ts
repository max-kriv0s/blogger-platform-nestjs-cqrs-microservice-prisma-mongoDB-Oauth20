import { User } from '@prisma/client';
import { CreateUserDto } from '@user/dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  validateSync,
} from 'class-validator';

export class UserEntity implements User {
  id: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  hashPassword: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  private constructor(userDto: CreateUserDto) {
    this.name = userDto.username;
    this.email = userDto.email;
    this.hashPassword = userDto.password;
  }

  static create(userDto: CreateUserDto) {
    const _user = new UserEntity(userDto);

    const errors = validateSync(_user);
    if (errors.length) {
    }
    return _user;
  }
}
