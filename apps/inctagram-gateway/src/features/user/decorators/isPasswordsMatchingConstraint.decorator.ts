import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserDto } from '../dto';

@ValidatorConstraint({ name: 'IsPasswordsMathing', async: false })
export class IsPasswordsMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as CreateUserDto;
    return obj.password === passwordRepeat;
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    throw 'Passwords must match';
  }
}
