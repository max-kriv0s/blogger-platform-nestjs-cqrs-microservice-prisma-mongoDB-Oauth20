import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ERROR_PASSWORD_MUST_CONTAIN } from '../user.constants';

@Injectable()
@ValidatorConstraint({ name: 'IsPasswordMustContain', async: false })
export class IsPasswordMustContain implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    return password.match(pattern) !== null;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return ERROR_PASSWORD_MUST_CONTAIN;
  }
}
