import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { IsPasswordsMatchingConstraint } from '../decorators';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  @Matches('^[a-zA-Z0-9_-]*$')
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  // @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  // @Matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')
  @Validate(IsPasswordsMatchingConstraint)
  passwordConfirm: string;
}
