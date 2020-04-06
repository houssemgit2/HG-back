import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap_main.ts');
  logger.log('starting the application....');

  const app = await NestFactory.create(AppModule);

  // ensuring all endpoints are protected from receiving incorrect data.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application listeneing in port ${port}`);
}
bootstrap();
