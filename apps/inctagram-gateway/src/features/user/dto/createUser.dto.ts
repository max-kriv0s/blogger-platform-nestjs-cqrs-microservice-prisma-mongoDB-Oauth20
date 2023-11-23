import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import {
  IsPasswordMustContain,
  IsPasswordsMatchingConstraint,
} from '../decorators';
import {
  ERROR_FORMAT_EMAIL,
  ERROR_LENGTH_PASSWORD,
  ERROR_LENGTH_USERNAME,
} from '../user.constants';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(6, 30, { message: ERROR_LENGTH_USERNAME })
  @Matches('^[a-zA-Z0-9_-]*$')
  username: string;

  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: ERROR_FORMAT_EMAIL,
    },
  )
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: ERROR_LENGTH_PASSWORD })
  @Validate(IsPasswordMustContain)
  password: string;

  @Validate(IsPasswordsMatchingConstraint)
  passwordConfirm: string;
}
