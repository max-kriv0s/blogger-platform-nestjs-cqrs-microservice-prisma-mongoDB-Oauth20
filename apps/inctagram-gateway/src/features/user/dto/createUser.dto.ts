import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsPasswordsMatchingConstraint } from '../decorators';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  @Validate(IsPasswordsMatchingConstraint)
  passwordConfirmation: string;
}
