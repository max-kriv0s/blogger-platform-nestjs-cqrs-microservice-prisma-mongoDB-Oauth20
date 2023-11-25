import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

export class ConfirmationRecoveryCodeDto {
  @ApiProperty({
    description: 'Recovery password code',
    type: 'string',
    example: uuidv4(),
  })
  @IsNotEmpty()
  @IsUUID()
  recoveryCode: string;
}
