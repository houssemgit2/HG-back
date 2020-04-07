import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { StoreModule } from './store/store.module';

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

  // swagger initialization
  const options = new DocumentBuilder()
    .setTitle('HealthyGroup')
    .setDescription('HealthyGRoup API')
    .setVersion('2.0')
    .addTag('hg')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    options,
  );
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application listeneing in port ${port}`);
}
bootstrap();
