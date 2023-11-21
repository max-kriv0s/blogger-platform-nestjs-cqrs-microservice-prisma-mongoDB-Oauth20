import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swagger/swaggerSetup';
import cookieParser from 'cookie-parser';
import { pipesSetup } from './pipes/pipesSetup';

export function configApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors();

  pipesSetup(app);
  swaggerSetup(app);
}
