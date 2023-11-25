import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swagger/swaggerSetup';
import cookieParser from 'cookie-parser';
import { pipesSetup } from './pipes/pipesSetup';
import { AppModule } from '../../app.module';
import { useContainer } from 'class-validator';
import { filterSetup } from './filters';

export function configApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  pipesSetup(app);
  filterSetup(app);
  swaggerSetup(app);
}
