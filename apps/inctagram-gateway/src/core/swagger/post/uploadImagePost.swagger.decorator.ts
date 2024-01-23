import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResponse, BadRequestResponse } from '../../responses';
import { FileUploadResponse } from '@libs/contracts';
import { BAD_REQUEST } from '../swagger.constants';

export function UploadImagePostSwaggerDecorator() {
  return applyDecorators(
    ApiUnauthorizedResponse({ type: ApiErrorResponse }),
    ApiOperation({
      summary: 'Upload image post',
    }),
    ApiOkResponse({ type: FileUploadResponse }),
    ApiBadRequestResponse({
      description: BAD_REQUEST,
      type: BadRequestResponse,
    }),
  );
}
