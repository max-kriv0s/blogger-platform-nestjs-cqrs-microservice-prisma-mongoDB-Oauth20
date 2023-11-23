import { INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from '../../filters';

export function filterSetup(app: INestApplication) {
  app.useGlobalFilters(new HttpExceptionFilter());
}
