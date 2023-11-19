import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { configApp } from './core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configApp(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, () => console.log(`Server started on port ${port}`));
}

bootstrap();
