import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as helmet from 'helmet';

import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './common/http-exception.filter';
import { TransformInterceptor } from './common/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('bootstrap_main.ts');
  logger.log('starting the application....');

  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  // ensuring all endpoints are protected from receiving incorrect data.
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.setGlobalPrefix('v1');
  // swagger initialization
  const options = new DocumentBuilder()
    .setTitle('HealthyGroup')
    .setDescription('HealthyGRoup API')
    .setVersion('2.0')
    .addTag('hg')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT;
  await app.listen(port);

  logger.verbose(`Application listening in port ${port}`);
}
bootstrap();
