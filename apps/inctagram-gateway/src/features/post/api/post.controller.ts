import { Controller, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor() {}

  @ApiOperation({
    summary: 'Editing Post',
  })
  @Put(':id')
  async updatePost() {}
}
