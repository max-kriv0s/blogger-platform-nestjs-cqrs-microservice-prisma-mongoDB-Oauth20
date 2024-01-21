import { ApiProperty } from '@nestjs/swagger';
import { Matches, Length, IsString, IsNotEmpty, IsUUID } from 'class-validator';
import {
  ERROR_LENGTH_DESCRIPTION,
  ERROR_LENGTH_IMAGE_ID,
} from '@gateway/src/features/post/post.constants';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post description',
    type: 'string',
    example: 'post_content',
    minLength: 3,
    maxLength: 500,
    pattern: '0-9; A-Z; a-z; _ ; -',
  })
  //Todo: Do I need matches here?
  @Length(3, 500, { message: ERROR_LENGTH_DESCRIPTION })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Image id',
    type: 'string',
    example: '9322c384-fd8e-4a13-80cd-1cbd1ef95ba8',
    minLength: 1,
    maxLength: 36,
    pattern: '0-9; A-Z; a-z; _ ; -',
  })
  @Matches(
    '^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$',
  )
  @Length(1, 36, { message: ERROR_LENGTH_IMAGE_ID })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  imageId: string;
}
