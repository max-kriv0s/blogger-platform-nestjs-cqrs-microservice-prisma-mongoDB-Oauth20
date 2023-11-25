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
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username',
    type: 'string',
    example: 'new_user',
    minLength: 6,
    maxLength: 30,
    pattern: '0-9; A-Z; a-z; _ ; -',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 30, { message: ERROR_LENGTH_USERNAME })
  @Matches('^[a-zA-Z0-9_-]*$')
  username: string;

  @ApiProperty({
    description: 'email',
    type: 'string',
    example: 'test@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail(
    {},
    {
      message: ERROR_FORMAT_EMAIL,
    },
  )
  email: string;

  @ApiProperty({
    description: 'password',
    type: 'string',
    example: 'new_testA0!',
    minLength: 6,
    maxLength: 20,
    pattern: `0-9; A-Z; a-z;
              !"#$%& '()*+,-./:;<=>? @ [\]^
              _\` \{ \| \} ~`,
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: ERROR_LENGTH_PASSWORD })
  @Validate(IsPasswordMustContain)
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    type: 'string',
    example: 'new_testA0!',
    minLength: 6,
    maxLength: 20,
    pattern: `0-9; A-Z; a-z;
            !"#$%& '()*+,-./:;<=>? @ [\]^
            _\` \{ \| \} ~`,
  })
  @Validate(IsPasswordsMatchingConstraint)
  passwordConfirm: string;
}
