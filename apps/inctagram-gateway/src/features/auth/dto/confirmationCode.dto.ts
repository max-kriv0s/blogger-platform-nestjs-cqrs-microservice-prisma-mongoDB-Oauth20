import { IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmationCodeDto {
  @IsNotEmpty()
  @IsUUID()
  code: string;
}
