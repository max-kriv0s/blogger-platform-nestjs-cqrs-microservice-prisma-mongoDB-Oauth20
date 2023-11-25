import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Validate,
} from 'class-validator';
import {
  IsPasswordMustContain,
  IsPasswordsMatchingConstraint,
} from '../decorators';
import { ERROR_LENGTH_PASSWORD } from '../user.constants';
import { v4 as uuidv4 } from 'uuid';

export class NewPasswordDto {
  @ApiProperty({
    description: 'new password',
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
  newPassword: string;

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
  PasswordConfirmation: string;

  @ApiProperty({
    description: 'Recovery password code',
    type: 'string',
    example: uuidv4(),
  })
  @IsNotEmpty()
  @IsUUID()
  recoveryCode: string;
}
