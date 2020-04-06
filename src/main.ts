import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap_main.ts');
  logger.log('starting the application....');
  const app = await NestFactory.create(AppModule);
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listeneing in port ${port}`);
}
bootstrap();
