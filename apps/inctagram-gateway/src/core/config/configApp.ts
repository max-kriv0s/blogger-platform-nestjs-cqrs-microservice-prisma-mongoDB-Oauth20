import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swagger/swaggerSetup';
import cookieParser from 'cookie-parser';

export function configApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  swaggerSetup(app);
}
